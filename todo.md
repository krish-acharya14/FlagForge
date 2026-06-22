

## IDENTIFIED ISSUES TO FIX:
- Fix Toast Error in AddAttachmentsModal
- Not allow invalid file characters during creation of attachments
- Add more nonBase64Types in MainWindow.xaml.cs and also in AttachmentRenderer.tsx
- Correct type ToolResult in types.ts and ToolAccordion.tsx
- Going from an attachment of a challenge to writeup of a different challenge triggers the toast for "Attachment Not Found".
- When one tool is running and another tool is also ran while the first is still running, the output that is received earliest is pasted to both the tools result

## Tools

### PDF tools

| Tool name | Purpose |
|-|-|
| pdfimages | embeded image extraction |
