import Dialog from '@mui/material/Dialog'
import { createStyles, withStyles } from '@mui/styles'

export const CustomizedDialog = withStyles((theme) =>
  createStyles({
    root: {
      margin: `auto -10px`,
      width: '100%',
    },
    paperWidthSm: {
      backgroundColor: 'var(--skel-back)',
      borderRadius: '23.5979px',
      maxWidth: 'initial',
      padding: '1.5em',
      width: '45vw',
      [theme.breakpoints.down('sm')]: {
        width: '100vw',
        margin: '0 0 0 20px',
      },
    },
  })
)(Dialog)

export const CustomizedDialogSmall = withStyles((theme) =>
  createStyles({
    root: {
      margin: `auto -10px`,
      width: '100%',
    },

    // tslint:disable-next-line: object-literal-sort-keys

    paperWidthSm: {
      backgroundColor: 'var(--skel-back)',
      borderRadius: '23.5979px',
      maxWidth: 'fit-content',
      padding: '1.5em',
      minWidth: '32vw',
      // maxWidth:'fit-content'

      [theme.breakpoints.down('sm')]: {
        width: '100vw',
        margin: '0 0 0 20px',
        padding: '1em',
      },
    },
  })
)(Dialog)
export const SimpleDialog = withStyles((theme) =>
  createStyles({
    root: {
      margin: `auto -10px`,
      width: '100vw',
    },

    // tslint:disable-next-line: object-literal-sort-keys

    paperWidthSm: {
      maxWidth: 'none',
      [theme.breakpoints.down('sm')]: {
        width: '100vw',
      },
    },
  })
)(Dialog)

export const CustomizedDialogNoPadding = withStyles((theme) =>
  createStyles({
    root: {
      margin: `auto -10px`,
      width: '100%',
    },

    // tslint:disable-next-line: object-literal-sort-keys

    paperWidthSm: {
      backgroundColor: 'var(--skel-back)',
      borderRadius: '23.5979px',
      width: '70vw',
      maxWidth: 900,
      padding: '1.5em',
      overflow: 'visible',
      [theme.breakpoints.down('sm')]: {
        margin: '0 0 0 20px',
        width: '100vw',
      },
    },
  })
)(Dialog)
