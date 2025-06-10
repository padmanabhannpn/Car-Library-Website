import React from "react";
import { DeleteIcon } from "../icons/Icons";

interface DeleteDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

// This dialog is used for delete confirmation
const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-2">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col items-center text-center">
        <DeleteIcon size={24} className="mb-2 text-red-600" />
        <p className="text-lg font-bold font-nunito text-black ">{title}</p>
        <p className="mt-2 text-base font-regular font-nunito text-black">
          {message}
        </p>

        <div className="mt-6 flex justify-center w-full space-x-5">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-white rounded-full border border-black hover:bg-white transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
