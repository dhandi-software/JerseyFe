import { client } from "~/api/client";

export interface UploadResponse {
  success: boolean;
  url: string;
  originalName?: string;
  size?: number;
  name?: string;
  type?: string;
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await client.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
