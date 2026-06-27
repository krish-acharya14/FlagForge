---
title: The Workspace
category: Basics
---

# The Workspace
---

The workspace is the central hub of FlagForge, where you can manage your CTF projects, challenges, and attachments. It provides a structured environment to organize your work and streamline your workflow.

The workspace is divided into two "views": the **Challenge View** and the **Attachment View**. The Challenge View allows you to create and manage challenges, while the Attachment View provides tools for analyzing and inspecting files.

We will be dicussing the "Challenge View" in this section, and the "Attachment View" in the next section.

---

## The Challenge View
The Challenge View is where you can create the writeups for each individual challenge and also able to see all the challenges in the current CTF.

The left sidebar shows the list of challenges in the current CTF, which can be filtered by tags as per your requirement. Clicking on one of the challenges will open it in the main area. This also expands the challenge in the sidebar allowing you to see the tags and attachments for that challenge.

---

### Creating a New Challenge
To create a new challenge, click on the **New Challenge** button in the left sidebar.

This prompts you to enter a name for the challenge. Once you provide a name and confirm, the new challenge will be created and opened in the main area.

---

### Challenge Writeup
The main area of the Challenge View is where you can write your solution for the selected challenge.

It consists of 4 Sections:

1. **Tags:** You can add tags to the challenge to categorize it. This helps in filtering and organizing challenges based on their type or difficulty.
2. **Description:** This section allows you to enter the challenge description of the CTF problem, which can be copied from the CTF platform. This is useful for reference while solving the challenge.
3. **Solution:** This is where you can write your solution for the challenge. You can use Markdown to format your writeup, making it easy to create structured and readable solutions. This is entirely for your own reference and can also act as a personal knowledge base for future reference.
4. **Flag:** Once you have solved the challenge, you can enter the flag in this section. On entering the flag, the challenge will be marked as solved, which can be seen in the left sidebar. This helps you keep track of your progress and know which challenges you have completed.

---

### The Search Bar
On the ribbon at the top of the Challenge View, there is a search bar that allows you to quickly find challenges by name or tags. This is especially useful when working with large CTFs with many challenges.

You can search using the challenge name or tags, and the results will be displayed just underneath the search bar. Clicking on a result will open the corresponding challenge in the main area.

---

### Filtering System
On the left sidebar, you can filter challenges based on if the challenge is solved or unsolved. This allows you to focus on the challenges that you still need to work on, making it easier to manage your time and prioritize your efforts.

---

## The Attachment View
The Attachment View is where you can analyze and inspect files that are attached to challenges. It provides a collection of built-in tools for examining different types of files, such as images, executables, archives, and more.

When you select a challenge in the Challenge View, the attachments for that challenge will be displayed in the left sidebar. Clicking on an attachment will open it in the main area, where you can use the available tools to analyze the file.

---

### Attachment Preview
The main area of the Attachment View provides a preview of the selected attachment (currently only for images, code, markdown, archives (zip), audio, and video files).

The preview allows you to quickly view the contents of the file without needing to open it in an external application. This is especially useful for quickly inspecting files and determining their relevance to the challenge.

---

### Attachment Editor
For certain types of files, such as text files, code files, and markdown files, you can edit the contents directly within FlagForge. This allows you to make notes or modifications to the file without needing to switch to an external editor.

The code files support syntax highlighting for various programming languages, making it easier to read and understand the code.

---

### Attachment Tools
FlagForge provides a collection of built-in tools for analyzing and inspecting attachments. These tools are automatically detected based on the file type and can be accessed from the main area when an attachment is selected.

Clicking on the "Attachment Info" button in the top right corner of the main area will open a panel that allows you to scan the file and view the available tools for that specific attachment.

The attachment tools are categorized into two types:

* Tools which are available for all file types, such as viewing metadata, hex inspection, strings extraction, and file hashing.
* Tools which are specific to certain file types, such as image analysis, archive exploration, and binary inspection.

Clicking on a tool will execute it on the selected attachment and display the results. Hence, you can quickly analyze and inspect files without needing to switch to external applications, streamlining your workflow and saving time.

<p class="text-primary">NOTE: Windows Subsystem for Linux (WSL) must be installed on your Windows machine in-order to use any of the attachment tools. Furthermore, each individual tool is required to be installed separately. The tools can be quickly installed by following instructions given within the app itself.</p>

Information about each individual tool can be found in the **Tools** section of the documentation.

---

FlagForge provides a bunch more tools, not in the workspace section, but in the **Converter Tools** section. These tools are inspired by CyberChef and provide a growing collection of utilities for transforming and decoding data. View that section for more information.

Happy hacking!
