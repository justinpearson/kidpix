# How to Save Your Artwork

## Quick Save
1. Click the **Save** button (floppy disk icon) in the top-left of the toolbar
2. Your browser will download a PNG image file
3. The file will be named with the current date and time

## Where Your File Goes
- **Chrome/Edge**: Usually downloads to your `Downloads` folder
- **Firefox**: May ask where to save, or use default Downloads folder
- **Safari**: Usually saves to Downloads, may ask for location

## Troubleshooting

**"Parts of the page are not loading or tools are unresponsive"**
- If running locally, verify your web server is still running (see [quick-start.md](../quick-start.md) for web server setup)
- Check browser console for JavaScript errors (F12 → Console tab)
- Try refreshing the page

**"Nothing happens when I click Save"**
- Check if your browser is blocking pop-ups or downloads
- Look for a download notification in your browser
- Try right-clicking the Save button and selecting "Save Link As"

**"The saved image is blank"**
- Make sure you've drawn something on the canvas first
- Try refreshing the page and drawing again
- Some browser extensions can interfere with canvas saving

**"The saved image has visual artifacts or strange transparency effects"**
- This can happen due to the multi-layer canvas system
- Try drawing on a solid background first (use the paint bucket tool to fill the canvas)
- If artifacts persist, try a different browser or disable hardware acceleration in browser settings

**"The saved image isn't the same size as the Kid Pix canvas"**
- This can happen due to browser scaling or high-DPI displays
- Try zooming your browser to 100% before saving
- On high-resolution displays, the saved image may be larger than it appears on screen

**"I want to save in a different format"**
- Kid Pix only saves as PNG files
- To convert to JPG or other formats, use an image editor or online converter

**"I found a bug or want to request a feature"**
- Please report issues at: https://github.com/vikrum/kidpix/issues
- Include your browser version and steps to reproduce the problem

## Tips
- Save frequently while working on complex artwork
- Your artwork is automatically saved in the browser and will persist between sessions
- The saved PNG file will have a transparent background if you haven't filled the entire canvas