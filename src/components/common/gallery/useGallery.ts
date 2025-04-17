import { useState, useEffect } from "react";
import {
  getGallery,
  uploadImage,
  uploadVideo,
  BodyProps,
  deleteMedia,
  uploadDocument,
} from "@/services/galleryApi";
import { toast } from "react-toastify";
import { useImageStore } from "@/store/galleryStore";
import { MediaProps } from "./ChooseFromGallery";

export const useGallery = () => {
  const { gallery, setGallery, setSelectedImages } = useImageStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page: number) => {
    const payload: BodyProps = {
      limit: 12,
      page,
      postType: "gallery",
    };

    try {
      const res = await getGallery(payload);
      setTotalPage(Math.ceil(res.pagination.total / 12));
      const data = res.results.map((prop) => ({
        url: prop.fileLocation,
        name: prop.title,
        fileType: prop.fileType,
        _id: prop._id,
      }));
      setGallery(data);
    } catch (error) {
      console.error("Gallery fetch error:", error);
      toast.error("Failed to fetch gallery data");
    }
  };

  const handleFileUpload = async (
    files: File[],
    setMedia?: React.Dispatch<
      React.SetStateAction<MediaProps[] | MediaProps | null>
    >,
    isMultiple?: boolean
  ) => {
    console.log(files);
    try {
      setLoading(true);
      for (const file of files) {
        let response;
        if (file.type.startsWith("image/")) {
          response = await uploadImage(file);
          toast.success("Image uploaded successfully");
        } else if (file.type.startsWith("video/")) {
          response = await uploadVideo(file);
          toast.success("Video uploaded successfully");
        } else if (file.type.startsWith("application/")) {
          response = await uploadDocument(file);
          toast.success("Document uploaded successfully");
        }

        if (setMedia && response) {
          const newMedia = response.results.map((item) => ({
            _id: item._id,
            url: item.url,
            name: item.name,
            fileType: item.fileType,
          }));

          if (isMultiple) {
            setMedia((prev) => {
              return Array.isArray(prev) ? [...prev, ...newMedia] : newMedia;
            });
          } else {
            setMedia(newMedia[0]);
          }
        }
      }
      // fetchData(currentPage);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    await handleFileUpload(files);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    setMedia?: React.Dispatch<
      React.SetStateAction<MediaProps[] | MediaProps | null>
    >,
    isMultiple?: boolean
  ) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await handleFileUpload(files, setMedia, isMultiple);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDeleteImage = async (i: number) => {
    const updatedImages = gallery.filter((_, index) => index !== i);
    setGallery(updatedImages);

    try {
      const response = await deleteMedia(gallery[i]._id);
      toast.success(response.message);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return {
    currentPage,
    totalPage,
    loading,
    setCurrentPage,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDeleteImage,
  };
};
