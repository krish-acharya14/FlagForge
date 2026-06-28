---
title: Exiftool Tool
category: Tools
---

# Exiftool Tool
---

`exiftool` is a platform-independent Perl library plus a command-line application for reading, writing, and editing meta information in a wide variety of files.

It supports many different types of metadata including EXIF, GPS, IPTC, XMP, JFIF, GeoTIFF, ICC Profile, Photoshop IRB, FlashPix, AFCP, and ID3, as well as the maker notes of many digital cameras.

---

## Information
`exiftool` can read and write metadata in image, audio, and video files. It can also extract metadata from PDF, Microsoft Office, and other document formats. The tool is widely used in digital forensics, photography, and media management.

---

## Using as FlagForge Tool
<p class="text-primary">NOTE: Windows Subsystem for Linux (WSL) must be installed on your Windows machine in-order to use the 'exiftool' tool. Also, the 'exiftool' tool must be installed separately. The tool can be quickly installed by following instructions given within the app itself.</p>

The `exiftool` tool is a general purpose FlagForge attachment tool, meaning that it can be run on any type of file. Simply select a file in the Attachment View and click on the "Attachment Info" button in the top right corner of the main area. Then, click on the "Exiftool" tool to execute it on the selected attachment.

---

## Example Usage
Suppose, you have a file named `image.jpg` attached to a challenge. To extract its metadata using the `exiftool` tool, you would select the file in the Attachment View and click on the "Exiftool" tool. The output might look like this:

```
ExifTool Version Number         : 13.50
File Name                       : image.jpg
Directory                       : /mnt/c/Users/username/Desktop
File Size                       : 7.6 kB
File Modification Date/Time     : 2026:06:23 13:26:39+00:00
File Access Date/Time           : 2026:06:23 13:26:40+00:00
File Inode Change Date/Time     : 2026:06:23 13:26:39+00:00
File Permissions                : -rwxrwxrwx
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : inches
X Resolution                    : 72
Y Resolution                    : 72
Comment                         : CTF{y0u_f1gur3d_0ut_h0w_t0_r34d_m3t4d4t4}
Image Width                     : 300
Image Height                    : 300
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 300x300
Megapixels                      : 0.090
```

This output shows various metadata fields extracted from the image file, including the file name, size, modification date, image dimensions, and a comment that contains a flag in this case.

## More Information
For more information about the `exiftool` command, you can refer to its official documentation [here](https://exiftool.org/).

Happy hacking!
