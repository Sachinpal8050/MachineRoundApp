export const sendMesageToServer = async (message: any) => {
  //NOTE: Dummy api
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return true;
    }
    return true;
  } catch (error) {
    console.log('Error', error);
    return true;
  }
};

export const sendRiskMessageToServer = async (payload: any) => {
  //NOTE: Dummy api
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        payload,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return true;
    }
    return true;
  } catch (error) {
    console.log('Error', error);
    return true;
  }
};
