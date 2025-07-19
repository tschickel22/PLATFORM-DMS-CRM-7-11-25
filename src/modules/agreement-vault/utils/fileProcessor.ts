import { PDFDocument } from 'pdf-lib'
import mammoth from 'mammoth'
import { TemplateFile } from '../types/template'

export class FileProcessor {
  static async processFile(file: File): Promise<TemplateFile> {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const fileType = file.type.includes('pdf') ? 'pdf' : 'docx'
    
    // Create object URL for the original file
    const originalUrl = URL.createObjectURL(file)
    
    let convertedPdfUrl: string | undefined

    // Convert DOCX to PDF if needed
    if (fileType === 'docx') {
      try {
        convertedPdfUrl = await this.convertDocxToPdf(file)
      } catch (error) {
        console.error('Failed to convert DOCX to PDF:', error)
        // Continue without conversion - we'll handle this gracefully
      }
    }

    const templateFile: TemplateFile = {
      id: fileId,
      name: fileId,
      originalName: file.name,
      type: fileType,
      url: originalUrl,
      size: file.size,
      uploadedAt: new Date(),
      convertedPdfUrl
    }

    return templateFile
  }

  static async convertDocxToPdf(file: File): Promise<string> {
    try {
      // Convert DOCX to HTML first
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      const html = result.value

      // Create a simple PDF from HTML
      // Note: This is a basic implementation. In production, you'd want to use
      // a more robust solution like Puppeteer or a server-side conversion service
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage()
      
      // For now, we'll create a simple text-based PDF
      // In a real implementation, you'd parse the HTML and create proper PDF content
      const { width, height } = page.getSize()
      
      // Strip HTML tags for basic text extraction
      const textContent = html.replace(/<[^>]*>/g, '').substring(0, 1000)
      
      page.drawText(textContent, {
        x: 50,
        y: height - 50,
        size: 12,
        maxWidth: width - 100,
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Error converting DOCX to PDF:', error)
      throw new Error('Failed to convert DOCX to PDF')
    }
  }

  static async mergePdfs(files: TemplateFile[]): Promise<string> {
    try {
      const mergedPdf = await PDFDocument.create()

      for (const file of files) {
        const pdfUrl = file.type === 'pdf' ? file.url : file.convertedPdfUrl
        if (!pdfUrl) continue

        const response = await fetch(pdfUrl)
        const pdfBytes = await response.arrayBuffer()
        const pdf = await PDFDocument.load(pdfBytes)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        
        pages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Error merging PDFs:', error)
      throw new Error('Failed to merge PDF files')
    }
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only PDF and DOCX files are allowed' }
    }

    return { valid: true }
  }

  static cleanup(files: TemplateFile[]) {
    files.forEach(file => {
      if (file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url)
      }
      if (file.convertedPdfUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(file.convertedPdfUrl)
      }
    })
  }
}