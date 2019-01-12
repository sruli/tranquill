const getNotebook = async (id) => {
  const response = await fetch(`/v1/notebooks/${id}`).then(res => res.json());
  return response;
};

export default {
  getNotebook,
};
