import { useContext, useState } from "react";
import { toast } from "sonner";
import { Context } from "../../../../../../context/Context";
import { handleDragOver } from "../../../../../../utility/dragDrop";
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';


function AddAttributeForm({ nestedIn = "", setOperation, updatedValue }) {

    const { menuOf, newFiles, setNewFiles, setUpdatedAttributes, uniqueFileName, setUniqueFileName } = useContext(Context);
    const [optionName, setOptionName] = useState("");
    const [isParent, setIsParent] = useState(false);

    const handleFileChange = (e, title) => {
        setNewFiles({
            ...newFiles,
            [title]: e.target.files[0]
        });
    };

    const handleDrop = (e, title) => {
        e.preventDefault();
        if (e.dataTransfer.files[0].type === 'image/svg+xml') {
            setNewFiles({
                ...newFiles,
                [title]: e.dataTransfer.files[0]
            });
        } else {
            toast.error('Please choose a svg file.');
        }
    };

    const selectedFile = newFiles[uniqueFileName]

    const updateValue = (prev) => {
        const tempAttributes = { ...prev }

        if (menuOf.length === 3) {
            tempAttributes[menuOf[0]].options[menuOf[1]].options[menuOf[menuOf.length - 1]] = updatedValue;
        } else if (menuOf.length === 2) {
            tempAttributes[menuOf[0]].options[menuOf[menuOf.length - 1]] = updatedValue;
        } else if (menuOf.length === 1) {
            tempAttributes[menuOf[menuOf.length - 1]] = updatedValue;
        }

        return tempAttributes;
    };

    const handleAdd = () => {


        if (optionName === "") {
            toast.error("Must add name for customization")
            return;
        }
        if (!isParent && !selectedFile) {
            toast.error("Must upload associated SVG file.")
            return;
        }

        setUpdatedAttributes((prev) => {
            const tempAttributes = updateValue(prev);

            console.log(tempAttributes);
            
            if (nestedIn) {
                if (menuOf.length === 2) {
                    if (!tempAttributes[menuOf[0]]?.options[menuOf[1]]?.options) {
                        tempAttributes[menuOf[0]].options[menuOf[1]].options = {};
                    }
                    tempAttributes[menuOf[0]].options[menuOf[1]].options[nestedIn].options[optionName] = {
                        path: uniqueFileName
                    };
                } else if (menuOf.length === 1) {
                    if (!tempAttributes[menuOf[0]].options[nestedIn].options) {
                        tempAttributes[menuOf[0]].options[nestedIn].options = {};
                    }
                    tempAttributes[menuOf[0]].options[nestedIn].options[optionName] = {
                        path: uniqueFileName
                    };
                }
            }
            else {
                if (isParent) {
                    if (menuOf.length === 2) {
                        tempAttributes[menuOf[0]].options[menuOf[1]].options[optionName] = {
                            selectedOption: " ",
                            options: {},
                        };
                    } else if (menuOf.length === 1) {
                        tempAttributes[menuOf[0]].options[optionName] = {
                            selectedOption: " ",
                            options: {},
                        };
                    }
                }
                else {
                    if (menuOf.length === 2) {
                        tempAttributes[menuOf[0]].options[menuOf[1]].options[optionName] = {
                            path: uniqueFileName
                        };
                    } else if (menuOf.length === 1) {
                        tempAttributes[menuOf[0]].options[optionName] = {
                            path: uniqueFileName
                        };
                    }
                }
            }

            return tempAttributes;
        })
        setUniqueFileName(`${uuidv4()}.svg`)
        setOperation("");
    }


    return (
        <div id='add' className='w-full'>
            <div className='pl-3 ml-3 border-l-2 border-dark/10 my-2'>
                {(!nestedIn && menuOf.length === 1) && <>
                    <div className="w-full grid grid-cols-2 h-12 mb-2 rounded-lg bg-design/50 items-center justify-center text-center gap-1 font-medium p-1">
                        <div onClick={() => {
                            setIsParent(false)
                        }} id="child" className={`bg-white h-full flex items-center justify-center rounded-lg cursor-pointer ${!isParent ? "bg-white" : "bg-white/5"}`}>
                            child
                        </div>
                        <div onClick={() => {
                            setIsParent(true)
                        }} id="parent" className={`bg-white h-full flex items-center justify-center rounded-lg cursor-pointer ${isParent ? "bg-white" : "bg-white/5"}`}>
                            <span>Parent</span>
                        </div>
                    </div>
                    <div className="flex items-center font-medium py-1">
                        <span><span className="text-red-500">**</span> {(isParent) ? `Insert parent option inside the ${menuOf[menuOf.length - 1]}` : `Insert child option inside the ${menuOf[menuOf.length - 1]}`}</span>
                    </div>
                </>
                }


                {isParent ? <div className='rounded-lg bg-white overflow-hidden py-4 px-4 border-2 border-dark/5'>
                    <div>
                        <p className='pb-2 font-medium'>Name</p>
                        <div className={`group border-dark/5 focus-within:border-dark/10 border-2 py-0.5 rounded-md flex items-center justify-center px-1`}>
                            <label htmlFor='newAttributeName' className='p-2 bg-dark/5 rounded-md'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-dark/60 group-hover:text-dark h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </label>
                            <input
                                id='newAttributeName'
                                required
                                type="text"
                                value={optionName}
                                onChange={(e) => setOptionName(e.target.value)}
                                className="bg-transparent h-full mt-0 w-full outline-none py-3 px-2"
                                placeholder="e.g my-design"
                            />
                        </div>
                    </div>

                    <div className="flex items-center font-medium pt-2 justify-end gap-1">
                        <span>- {isParent && 'No need for any file uploads'} </span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-blue-700 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </div>
                    <div className='flex items-center justify-end gap-3 text-sm pt-10'>
                        <button type="button" onClick={() => setOperation("")} className={`flex items-center justify-center gap-3 hover:bg-zinc-400/30 py-2 px-3 rounded-md  text-dark font-medium relative bg-design`}>Cancel</button>
                        <button onClick={handleAdd} className={`flex items-center justify-center gap-3 hover:bg-green-300 py-2 px-3 rounded-md  text-dark font-medium relative bg-green-300/90`}>Add Option</button>
                    </div>
                </div> : <div className='rounded-lg bg-white overflow-hidden py-4 px-4 border-2 border-dark/5'>
                    <div>
                        <p className='pb-2 font-medium'>Name</p>
                        <div className={`group border-dark/5 focus-within:border-dark/10 border-2 py-0.5 rounded-md flex items-center justify-center px-1`}>
                            <label htmlFor='newAttributeName' className='p-2 bg-dark/5 rounded-md'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-dark/60 group-hover:text-dark h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </label>
                            <input
                                id='newAttributeName'
                                required
                                type="text"
                                value={optionName}
                                onChange={(e) => setOptionName(e.target.value)}
                                className="bg-transparent h-full mt-0 w-full outline-none py-3 px-2"
                                placeholder="e.g my-design"
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 w-full h-full items-center justify-between px-2 pt-8'>
                        <div className='w-full'>
                            <p className='pb-3 font-medium text-lg'>Upload File</p>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex flex-col gap-2 '>
                                    <input
                                        id={"optionName"}
                                        type="file"
                                        multiple
                                        accept='image/svg+xml'
                                        onChange={(e) => handleFileChange(e, uniqueFileName)}
                                        className="hidden"
                                    />

                                    <div
                                        onClick={() => document.getElementById("optionName").click()}
                                        onDrop={(e) => { handleDrop(e, uniqueFileName) }}
                                        onDragOver={handleDragOver}
                                        className="w-full aspect-square p-4 border-2 border-dashed border-gray-400 cursor-pointer flex items-center justify-center min-h-72"
                                    >
                                        <span className='text-sm w-60 mx-auto text-center'>Drag and drop the customization option in SVG format.</span>
                                    </div>
                                </div>
                                {(
                                    selectedFile && <div className=" flex gap-2 flex-col">
                                        <div className='aspect-square p-5 bg-design/5 border-2 border-dark/5 border-gray-400 w-full overflow-hidden items-center justify-center flex flex-col'>
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt={selectedFile.name}
                                                className="w-full rounded-xl"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center justify-end gap-3 text-sm pt-10'>
                        <button type="button" onClick={() => setOperation("")} className={`flex items-center justify-center gap-3 hover:bg-zinc-400/30 py-2 px-3 rounded-md  text-dark font-medium relative bg-design`}>Cancel</button>
                        <button onClick={handleAdd} className={`flex items-center justify-center gap-3 hover:bg-green-300 py-2 px-3 rounded-md  text-dark font-medium relative bg-green-300/90`}>Add Option</button>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}
AddAttributeForm.propTypes = {
    nestedIn: PropTypes.string,
    updatedValue: PropTypes.object.isRequired,
    setOperation: PropTypes.func.isRequired,
};

export default AddAttributeForm;