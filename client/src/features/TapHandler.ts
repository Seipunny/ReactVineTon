import axios, { AxiosError } from 'axios';

interface TapResponse {
  success: boolean;
  message: string;
}

export async function handleTap(address: string | undefined): Promise<TapResponse> {
  if (!address) {
    return {
      success: false,
      message: "No address available"
    };
  }

  try {
    const response = await axios.post('http://localhost:3000/updateCount', { userId: address });
    return {
      success: true,
      message: `Updated count: ${response.data}`
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          success: false,
          message: `Error: ${error.response.data}`
        };
      } else {
        return {
          success: false,
          message: 'Error: The request was made but no response was received'
        };
      }
    } else {
      return {
        success: false,
        message: 'Error: An unexpected error occurred'
      };
    }
  }
}
