import imagesize from 'image-size'
import { Tokens } from 'marked'
import fs from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'

import { MarkdownImageAdapter, MarkdownImageItem } from '../types'
import { getImageExtension, isHttp } from '../utils'

const MAX_IMAGE_WIDTH = 600

const SVG_HEAD = Buffer.from('<svg')

export const downloadImage: MarkdownImageAdapter = async function (token: Tokens.Image) {
  const src = token.href
  if (!src) {
    return null
  }

  try {
    const buffer = await loadImage(src)

    if (isSvgBuffer(buffer)) {
      return handleSvgImage(buffer)
    }

    const { width, height, type } = imagesize(buffer)

    const supportType = getImageExtension(src, type)

    if (!supportType) {
      return null
    }

    if (supportType === 'webp') {
      console.error(`[MarkdownDocx] Webp is not supported in the nodejs environment`)
      return null
    }

    return {
      type: supportType,
      data: buffer,
      width,
      height,
    }
  } catch (error) {
    console.error(`[MarkdownDocx] downloadImageError`, error)
    return null
  }
}

function isSvgBuffer(buffer: Buffer): boolean {
  return buffer.indexOf(SVG_HEAD) !== -1
}

function handleSvgImage(buffer: Buffer): MarkdownImageItem {
  const { width, height } = parseSvgDimensions(buffer)

  return {
    type: 'svg',
    data: buffer,
    width: Math.min(width, MAX_IMAGE_WIDTH),
    height: width ? Math.round(height * Math.min(1, MAX_IMAGE_WIDTH / width)) : height,
  }
}

function parseSvgDimensions(buffer: Buffer): { width: number; height: number } {
  const head = buffer.toString('utf-8', 0, 2000)

  const widthMatch = head.match(/width\s*=\s*["'](\d+(?:\.\d+)?)\s*(?:px|pt|in|mm|cm)?["']/i)
  const heightMatch = head.match(/height\s*=\s*["'](\d+(?:\.\d+)?)\s*(?:px|pt|in|mm|cm)?["']/i)

  if (widthMatch && heightMatch) {
    return {
      width: parseFloat(widthMatch[1]),
      height: parseFloat(heightMatch[1]),
    }
  }

  const viewBoxMatch = head.match(/viewBox\s*=\s*["']([-\d.]+)\s+([-\d.]+)\s+([\d.]+)\s+([\d.]+)["']/i)
  if (viewBoxMatch) {
    return {
      width: parseFloat(viewBoxMatch[3]),
      height: parseFloat(viewBoxMatch[4]),
    }
  }

  return { width: 600, height: 450 }
}

function loadImage(src: string) {
  if (isHttp(src)) {
    return new Promise<Buffer>((resolve, reject) => {
      const agent = src.startsWith('https') ? https : http
      agent.get(src, (res) => {
        const chunks: Buffer[] = []
        res.on('data', (chunk) => {
          chunks.push(chunk)
        })
        res.on('end', () => {
          resolve(Buffer.concat(chunks))
        })
        res.on('error', (err) => {
          reject(new Error(`Failed to load image: ${err.message || err}`))
        })
      })
    })
  }
  return fs.readFile(src)
}
