import { Spinner, toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { Image, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../lib/axios";

export default function ChangeCover({setcoverphoto}:{setcoverphoto:(x:string)=>void}) {
    const [fileName, setFileName] = useState("");
    const { register, handleSubmit } = useForm({
        defaultValues: {
            photo: undefined as FileList | undefined,
        }
    });

    function changePhoto(values: { photo?: FileList }) {
        const formData = new FormData();
        if (values.photo?.[0]) {
            formData.append("cover", values.photo[0]);
        }
        return axiosInstance.put(`/users/upload-cover`, formData);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: changePhoto,
        mutationKey: ["changePhoto"],
        onSuccess: (data) => {
            console.log("data", data.data.data.cover);
            setcoverphoto(data.data.data.cover)
            toast.success("sucsess");
        },
        onError: (erorr: any) => {
            console.log("erorr", erorr.response);
            toast.danger("unexpected erorr");
        }
    });

    return (
        <form onSubmit={handleSubmit((values) => mutate(values))} className="mx-5 mb-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-blue-600">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Image size={18} />
                    </span>
                    <span className="min-w-0 truncate">{fileName || "Choose cover photo"}</span>
                    <input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        {...register("photo", {
                            onChange: (event) => setFileName(event.target.files?.[0]?.name ?? ""),
                        })}
                    />
                </label>
                <button
                    disabled={isPending}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isPending ? <Spinner size="sm" className="text-white" /> : <UploadCloud size={17} />}
                    {isPending ? "Saving..." : "Save cover"}
                </button>
            </div>
        </form>
    );
}
