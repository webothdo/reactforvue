export const useOpenDialog = () => {
  const isDialogOpen = useState<boolean>("isDialogOpen", () => false);

  const openDialog = () => {
    isDialogOpen.value = true;
  };

  const closeDialog = () => {
    isDialogOpen.value = false;
  };

  return {
    isDialogOpen,
    openDialog,
    closeDialog,
  };
};
