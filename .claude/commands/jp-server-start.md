Launch the local dev server using `yarn dev` in a sub-shell and let me know if
you see any errors on its stdout / stderr. Recall that this project is
configured to log **browser console errors** to the dev server's stdout, so
the User's actions in the app may result in errors displaying in the dev
server's stdout. Remember to check its stdout before and after each user
notification, to catch any browser errors right away, and report them to the
User for consideration / debugging.
