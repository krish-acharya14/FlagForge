## PRE TOOLS TODO:
- ZIP (Compressed Files) Renderer
- Fix Toast Error in AddAttachmentsModal
- File Info in Attachment View
- Not allow invalid file characters during creation of attachments
- Add more nonBase64Types in MainWindow.xaml.cs and also in AttachmentRenderer.tsx
- Correct type ToolResult in types.ts and ToolAccordion.tsx

## Tools

### Image tools

| Tool name | Purpose |
| exiftool | metadata |
| strings | strings |
| xxd | hexfile |
| binwalk | embedded data |
| steghide | hidden files |
| zsteg | stego tool (better than steghide) |
| binwalk -E | entropy checker in a file |
| hashid | analyses used hash in string |
| wireshark | exploring pcap files |
| pngfix | repair corrupted pngs |
| zbarimg | barcode / qrcode scanner |

### PDF tools

| Tool name | Purpose |
| pdfinfo | metadata |
| qpdf | decompress pdfs |
| pdftotext | text extraction from pdf |
| pdfimages | embeded image extraction |
| mutool | analyze pdf internals |

### Audio tools 

| Tool name | Puspose |
| sonic-visualiser | spectrogram |
| csound | code to sound converter |
| ffprobe | audio metadata |
