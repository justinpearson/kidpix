Launch the local dev server using `yarn dev-app` in a sub-shell and let me know if
you see any errors on its stdout / stderr.

To monitor browser console errors, use Playwright MCP to navigate to the application
and access console messages directly. This is a cleaner approach than the previous
vite-plugin-terminal method, as it monitors the browser directly rather than routing
errors through the webserver.

Example workflow:
1. Start the dev server: `yarn dev-app` (in background)
2. Use Playwright MCP to navigate to http://localhost:5173/
3. Monitor console messages using the Playwright MCP console tools
4. Report any errors to the User for debugging
