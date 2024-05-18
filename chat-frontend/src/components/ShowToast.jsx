const ShowToast = (title, status, description) => {
  return {
    title,
    status,
    duration: 2000,
    isClosable: true,
    position: "top",
    description: description || undefined,
  };
};

export let configData = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    headers,
  };
};

export default ShowToast;
