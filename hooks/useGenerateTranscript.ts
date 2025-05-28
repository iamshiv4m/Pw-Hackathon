import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api/endpoints";

interface GenerateTranscriptResponse {
  success: boolean;
  data: any;
}

interface GenerateTranscriptVariables {
  videoUrl: string;
}

const generateTranscript = async (
  variables: GenerateTranscriptVariables
): Promise<GenerateTranscriptResponse> => {
  const formData = new FormData();
  formData.append("videoUrl", variables.videoUrl);

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.GENERATE_TRANSCRIPT}`,
    {
      method: "POST",
      headers: {
        "Client-Id": "5eb393ee95fab7468a79d189",
        "Client-Type": "WEB",
        "Client-Version": "1.0.0",
        "xx-kong-userid": "6556ec8b2cfe405c1eeed02d",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate transcript");
  }

  return response.json();
};

export const useGenerateTranscript = () => {
  return useMutation<
    GenerateTranscriptResponse,
    Error,
    GenerateTranscriptVariables
  >({
    mutationFn: generateTranscript,
  });
};
