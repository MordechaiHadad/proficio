import AlertDialogComponent from './AlertDialog.svelte';
import Header from './AlertDialogHeader.svelte';
import Title from './AlertDialogTitle.svelte';
import Description from './AlertDialogDescription.svelte';
import Footer from './AlertDialogFooter.svelte';
import Confirm from './AlertDialogConfirm.svelte';
import Cancel from './AlertDialogCancel.svelte';

type AlertDialogType = typeof AlertDialogComponent & {
    Header: typeof Header;
    Title: typeof Title;
    Description: typeof Description;
    Footer: typeof Footer;
    Confirm: typeof Confirm;
    Cancel: typeof Cancel;
};

const AlertDialog = AlertDialogComponent as AlertDialogType;

AlertDialog.Header = Header;
AlertDialog.Title = Title;
AlertDialog.Description = Description;
AlertDialog.Footer = Footer;
AlertDialog.Confirm = Confirm;
AlertDialog.Cancel = Cancel;

export default AlertDialog;
