---
title: File Tool
category: Tools
---

# File Tool
---

`file` is a built-in command line utility in Unix-like operating systems that is used to determine the type of a file. It examines the contents of a file and provides information about its format, such as whether it is a text file, an executable, an image, or another type of file.

---

## Information
It determines the file type by performing a series of three sequential tests:
1. Filesystem test: Checks the file's metadata to see if it matches known file types.
2. Magic number test: Reads the first few bytes of the file to identify its type based on known magic numbers.
3. Language test: If the first two tests are inconclusive, it may analyze the file's content to determine its type based on patterns and characteristics.

---

## Using as FlagForge Tool
<p class="text-primary">NOTE: Windows Subsystem for Linux (WSL) must be installed on your Windows machine in-order to use the 'file' tool.</p>

The `file` tool is a general purpose FlagForge attachment tool, meaning that it can be run on any type of file. Simply select a file in the Attachment View and click on the "Attachment Info" button in the top right corner of the main area. Then, click on the "File" tool to execute it on the selected attachment.

---

## Example Usage
Suppose, you have a file named `image.png` attached to a challenge. To determine its type using the `file` tool, you would select the file in the Attachment View and click on the "File" tool. The output might look like this:

```
image.png: JPEG image data, 750 x 694, 8-bit/color RGBA, non-interlaced
```

Notice how the output provides information about the file type as JPEG, instead of PNG. This is because the `file` tool examines the actual contents of the file, rather than relying solely on the file extension. Hence, we can rename the file to `image.jpg` and run the jpeg specific tools on it!

---

## More Information
For more information about the `file` command, you can refer to its manual page [here](https://www.man7.org/linux/man-pages/man1/file.1.html).

Happy hacking!
