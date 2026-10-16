---
layout: post
permalink: /posts/research/2016/02/17/type-1-font-for-matplotlab/
title: "Type 1 Font for Matplotlib"
date: "2016-02-17T16:57:27Z"
comments: true
description: "Getting publication-ready fonts out of Matplotlib, and checking what ends up in your PDF."
keywords: ""
categories: Research

tags:
- Python
- Matplotlib
- Type 1
---

When figures are generated in Matplotlib, they use "Type 3" font by default, which is conflict with some publishers' requirements for posting a paper in some conference. This essay mentions the solution for this issue.

### Check fonts used in a PDF with `PdfFonts`

`PdfFonts` can be installed with `Brew` in Mac:

```bash
	brew install xpdf
```

or

```bash
	brew install poppler
```

Note that both tools are based on "XQuartz", a X Window System running on OS X. So following the instructions if error occurs.

After you are done with the installation, you can run following command in the terminal to check fonts in a PDF file:

```bash
	pdffonts /path/to/file.pdf
```

In OS X, there is an alternative solution to get the font information. However, it doesn't work for `pdflatex` PDFs.

```bash
	strings /path/to/document.pdf | grep -i FontName
```

In my case, the figures drawn by Matplotlib have "Type 3". This is not allowed in some publishers' rules. So I need to redraw figures with "Type 1".


### Matplotlib configurations

Use the following statements to configure the Matplotlib. The figures will be plotted with "Type 3" font. However, the fonts of letters and numbers may vary. For example, the letters are bold, while the numbers are not.

```python
matplotlib.rcParams['ps.useafm'] = True
matplotlib.rcParams['pdf.use14corefonts'] = True
matplotlib.rcParams['text.usetex'] = True
```

Found an alternative solution online:

```python
matplotlib.rcParams['pdf.fonttype'] = 42
matplotlib.rcParams['ps.fonttype'] = 42
```
