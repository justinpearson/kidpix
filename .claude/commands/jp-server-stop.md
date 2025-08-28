Stop the local dev server (`vite`, from `yarn dev`) in the following way:

If vite / yarn dev is running in your sub-shell, retrieve any last stdout / stderr lines from the sub-shell, report them to the User, and consider debugging them. Then simply type 'q' and ENTER to stop vite.

If that doesn't work, try running `yarn dev-stop` -- the `package.json` file defines a script `yarn dev-stop` that kills the pid recorded in `.vite.pid`.

If THAT doesn't work, you might have to see if there's a vite process running elsewhere. Be careful to only kill vite processes for THIS project (kidpix), and not other vite processes that may be locally running other apps.
