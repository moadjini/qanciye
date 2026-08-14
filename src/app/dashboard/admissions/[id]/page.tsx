'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Admission } from '@/lib/supabase'
import AdmissionDocument from '@/components/AdmissionDocument'
import { ArrowLeft, Edit, Download, Printer, Trash2, Copy } from 'lucide-react'
import { toast } from 'react-hot-toast'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export default function ViewAdmissionPage() {
  const params = useParams()
  const router = useRouter()
  const [admission, setAdmission] = useState<Admission | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchAdmission()
  }, [params.id])

  const fetchAdmission = async () => {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setAdmission(data)
    } catch (error) {
      console.error('Error fetching admission:', error)
      toast.error('Failed to load admission')
      router.push('/dashboard/admissions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('admissions')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      toast.success('Admission deleted successfully')
      router.push('/dashboard/admissions')
    } catch (error) {
      console.error('Error deleting admission:', error)
      toast.error('Failed to delete admission')
    }
  }

  const handleDuplicate = async () => {
    if (!admission) return

    try {
      const { error } = await supabase
        .from('admissions')
        .insert({
          full_name: admission.full_name,
          mother_name: admission.mother_name,
          date_of_birth: admission.date_of_birth,
          customer_number: admission.customer_number,
          gender: admission.gender,
          place_of_birth: admission.place_of_birth,
          national_id: admission.national_id,
          address: admission.address,
          student_photo_url: admission.student_photo_url,
          more_details: admission.more_details,
        })

      if (error) throw error

      toast.success('Admission duplicated successfully')
      router.push('/dashboard/admissions')
    } catch (error) {
      console.error('Error duplicating admission:', error)
      toast.error('Failed to duplicate admission')
    }
  }

  const handlePrint = () => {
    const printContent = document.getElementById('admission-document')
    if (!printContent) return

    const originalContents = document.body.innerHTML
    document.body.innerHTML = printContent.outerHTML
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  const handleDownloadPDF = async () => {
    if (!admission) return

    try {
      toast.loading('Generating PDF...')

      const element = document.getElementById('admission-document')
      if (!element) {
        toast.dismiss()
        toast.error('Document element not found')
        return
      }

      const pdf = new jsPDF('p', 'mm', 'a4')
      const html2canvas = (await import('html2canvas')).default

      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.9)
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
      pdf.save(`Qanciye-Admission-${admission.full_name.replace(/\s+/g, '-')}.pdf`)

      toast.dismiss()
      toast.success('PDF generated successfully')
    } catch (error) {
      toast.dismiss()
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF: ' + (error as Error).message)
    }
  }

  const handleDownloadWord = async () => {
    if (!admission) return

    try {
      toast.loading('Generating Word document...')

      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      }

      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              text: 'QANCIYE ADMISSION',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: 'STUDENT INFORMATION FORM',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Full Name: ', bold: true }),
                new TextRun(admission.full_name),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Mother\'s Name: ', bold: true }),
                new TextRun(admission.mother_name),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Date of Birth: ', bold: true }),
                new TextRun(formatDate(admission.date_of_birth)),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Customer Number: ', bold: true }),
                new TextRun(admission.customer_number),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Gender: ', bold: true }),
                new TextRun(admission.gender),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Place of Birth: ', bold: true }),
                new TextRun(admission.place_of_birth),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'National ID: ', bold: true }),
                new TextRun(admission.national_id),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Address: ', bold: true }),
                new TextRun(admission.address),
              ],
            }),
            ...(admission.more_details ? [
              new Paragraph({
                children: [
                  new TextRun({ text: 'More Details: ', bold: true }),
                  new TextRun(admission.more_details),
                ],
              }),
            ] : []),
            new Paragraph({
              children: [
                new TextRun({ text: 'VERIFICATION INFORMATION', bold: true }),
              ],
            }),
            new Paragraph({
              text: 'This admission document is officially issued by Qanciye Admission. All student information has been verified and recorded in our system.',
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'CONTACT US', bold: true }),
              ],
            }),
            new Paragraph({
              text: 'Phone: +252 68 6913144',
            }),
            new Paragraph({
              text: 'Email: info@qanciye.com',
            }),
            new Paragraph({
              text: 'Website: www.qanciye.com',
            }),
            new Paragraph({
              text: 'Turkey & Somalia',
            }),
            new Paragraph({
              text: 'PREPARED BY: Qanciye Admission',
            }),
            new Paragraph({
              text: `DATE: ${formatDate(admission.created_at)}`,
            }),
            new Paragraph({
              text: 'YOUR FUTURE STARTS HERE',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
          ],
        }],
      })

      const blob = await Packer.toBlob(doc)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Qanciye-Admission-${admission.full_name.replace(/\s+/g, '-')}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.dismiss()
      toast.success('Word document generated successfully')
    } catch (error) {
      toast.dismiss()
      console.error('Error generating Word document:', error)
      toast.error('Failed to generate Word document')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!admission) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Admission not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/dashboard/admissions/${admission.id}/edit`)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleDuplicate}
            className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </button>
          <button
            onClick={() => setDeleteId(admission.id)}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <AdmissionDocument admission={admission} />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Admission?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this admission? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
