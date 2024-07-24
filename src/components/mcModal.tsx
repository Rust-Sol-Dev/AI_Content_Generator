import { useState, useEffect } from 'react';
import DropdownComponent from './dropdownComponent';
import { generateImage } from '@/utils/dalleAPI';
import Image from 'next/image';
import { generateText } from '../utils/openaiAPI';

interface ModalProps {
    show: boolean;
    onClose: () => void;
}
  
interface ProjectType {
    id?: number;
    title: string;
    description: string;
    logoUrl: string;
}

const MCModal: React.FC<ModalProps> = ({ show, onClose }) => {
    const [description, setDescription] = useState('');
    const [marketContentType, setMarketContentType] = useState<string>('tweet');
    const [preview, setPreview] = useState('');
    const [spinner, setSpinner] = useState(false);

    const applyContent = async () => {
      if (description.length === 0){
        return false
      }
      let prompt = `Create marketing content centered on '${description}' in '${marketContentType}' way.`
      setSpinner(true)
      const response: string | null = await generateText(prompt);
      if (response)
        setPreview(response);

      setSpinner(false)
    }
    
    const saveContent = async () => {
      // save preview
      
      onClose();
      alert("Successfully saved!")
    }
    
    return (
      <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${show ? '' : 'hidden'}`}>
        {/* Darkened overlay */}
        <div className={`fixed inset-0 bg-black opacity-50 ${show ? '' : 'hidden'}`}></div>
        <div className="bg-white p-8 rounded-md shadow-lg relative z-10 w-3/4 h-3/4">
        <h2 className="text-2xl font-semibold mb-3">Marketing Content Generator</h2>
        
        <div className="flex flex-row">
          {/* Dropdown Menu */}
          <div className="flex-1 mr-4">
            <DropdownComponent label="Type" options={['tweet', 'website copy']} onSelectOption={setMarketContentType} />
          </div>

          {/* Textarea for Description */}
          <div className="flex-1 mr-4">
            <h3 className="font-semibold mb-2">Short Description</h3>
            <textarea
              className="border border-gray-300 p-2 mb-4 rounded-md w-full"
              placeholder="Enter description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div>
          {/* Preview Section */}
          <div className="flex-1">
            <div>
              <h3 className="font-semibold mb-2">Preview</h3>
              {spinner ? (
                <div className="inset-0 flex items-center justify-center col-span-12">
                <div className="flex">
                  <div className="loader ease-linear rounded-full border-t-8 border-r-8 border-b-8 border-blue-500 h-12 w-12 mr-1 animate-spin"></div>
                </div>
              </div>
              
              ) : (
              <div className="border border-gray-300 p-3 h-40">
                 <textarea
              className="border border-gray-300 p-2 mb-4 rounded-md w-full"
              placeholder="Enter description"
              rows={4}
              value={preview}
              onChange={(e) => setDescription(e.target.value)}
              />
              </div>)}
              </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={applyContent}
          >
            Apply
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={saveContent}
          >
            Save
          </button>
        </div>
      </div>

      </div>
    );
  };

export default MCModal;