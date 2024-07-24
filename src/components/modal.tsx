import { useState, useEffect } from 'react';
import { insertData } from '@/utils/supabaseClient';
import DropdownComponent from './dropdownComponent';
import { generateText } from '../utils/openaiAPI';
import { generateImage } from '@/utils/dalleAPI';
import Image from 'next/image';

interface ModalProps {
    show: boolean;
    onClose: () => void;
}
  
interface ProjectType {
    id?: number;
    title: string;
    description: string;
    logoUrl?: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose }) => {
    const [description, setDescription] = useState('');
    const [step, setStep] = useState(1);
    const [projectData, setProjectData] = useState<any>({ title: [], description: [] })
    const [spinner, setSpinner] = useState(false);
  
    const [selectedTitleIdx, setSelectedTitleIdx] = useState<number | null>(null);
    const [selectedDescIdx, setSelectedDescIdx] = useState<number | null>(null);
  
    const [selectedTitle, setSelectedTitle] = useState<string>("");
    const [selectedDesc, setSelectedDesc] = useState<string>("");
  
    const [selectedLogo, setSelectedLogo] = useState<string>("");
    const [logoType, setLogoType] = useState<string>("");
    const [logoArtTech, setLogoArtTech] = useState<string>("");
    const [logoStyle, setLogoStyle] = useState<string>("");
    const [logoSpecInst, setLogoSpecInst] = useState<string>("");
    const [logoArtGenre, setLogoArtGenre] = useState<string>("");
    const [logoFamousName, setLogoFamousName] = useState<string>("");
    const [logoLoading, setLogoLoading] = useState(false);
  
  
    const insertData = async (data: ProjectType) => {
      insertData
  
      onClose();
    };
  
    const goToLogoPge = async () => {
      if (selectedTitle.length == 0 || selectedDesc.length == 0) {
        alert("Select the Title and Description!")
        return false
      }
      setStep(3)
    }
  
    const generateTitleDesc = async () => {
      if (description.length == 0) {
        alert("Input a short description!")
        return false
      }
      setStep(2)
      setSpinner(true);
      /*
      description = 'this is the project that represents a happy family'
      */
      let prompt = `
          Create 10 distinct titles and longer descriptions separately centered on ${description}.
          Display the result below type:
          {
          title:[
            'happy family',
            'happy society',
            'happy factory',
          ],
          description:[
            'this is the project that is called "happy family"',
            'this is the project that is called "happy society"',
            'this is the project that is called "happy factory"',
          ]
        }
        `

      const response: string | null = await generateText(prompt);
      let result = {}
      setSpinner(false)
      if(response !== null){
        result = JSON.parse(response)
      }
      // const result = {
      //   title: [
      //     'happy family',
      //     'happy society',
      //     'happy factory',
      //   ],
      //   description: [
      //     'this is the project that is called "happy family"',
      //     'this is the project that is called "happy society"',
      //     'this is the project that is called "happy factory"',
      //   ]
      // }
  
      setProjectData(result)
  
    };
  
    const generateLogo = async () => {
      if (selectedTitle.length == 0 || selectedDesc.length == 0) {
        alert("select the items!");
        return false;
      }
      setLogoLoading(true);
      const prompt = logoType + " for a project that the title and the description are '" +
        selectedTitle + "' and '" + selectedDesc + "', " +
        logoStyle + ", " + logoArtTech + ", " + logoSpecInst + ", " + logoArtGenre + ", " + logoFamousName + ".";
  
      const responseLogoUrl = await generateImage(prompt);
      if (responseLogoUrl !== undefined) {
        setSelectedLogo(responseLogoUrl)
      }
      setLogoLoading(false);
    }
  
    const save = async (newTitle: string, newdescription: string, newLogoDalleUrl: string) => {
      let newProject: ProjectType = { title: newTitle, description: newdescription, logoUrl: newLogoDalleUrl }
      if (selectedLogo.length == 0) {
        newProject = { title: newTitle, description: newdescription }
        // alert("Please Make your Logo!")
        // return false
      }
  
      insertData(newProject)
    }
  
    const handleTitleClick = (index: number) => {
      if (selectedTitleIdx === index) {
        setSelectedTitleIdx(null); // Unselect the item if it's already selected
        setSelectedTitle("")
      } else {
        setSelectedTitleIdx(index); // Select the clicked item
        setSelectedTitle(projectData.title[index])
      }
    };
  
    const handleDescClick = (index: number) => {
      if (selectedDescIdx === index) {
        setSelectedDescIdx(null); // Unselect the item if it's already selected
        setSelectedDesc("")
      } else {
        setSelectedDescIdx(index); // Select the clicked item
        setSelectedDesc(projectData.description[index])
      }
    };
  
  
    return (
      <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${show ? '' : 'hidden'}`}>
        {/* Darkened overlay */}
        <div className={`fixed inset-0 bg-black opacity-50 ${show ? '' : 'hidden'}`}></div>
        <div className="bg-white p-8 rounded-md shadow-lg relative z-10 w-3/4">
          {step === 1 && ( 
            <div className=''>
              <h2 className="text-2xl font-semibold mb-3">Short description</h2>
              <textarea
                className="border border-gray-300 p-2 mb-4 rounded-md w-full"
                placeholder="Enter description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="col-span-full flex justify-end">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={generateTitleDesc}
                >
                  Next
                </button>
              </div>
            </div>
          )}
  
          {step === 2 && ( 
            <div className="grid grid-cols-12 gap-4 w-90">
              <h2 className="col-span-full text-2xl font-semibold mb-3">Select Titles and Descriptions</h2>
              {spinner ? (
                <div className="inset-0 flex items-center justify-center col-span-12 h-80">
                <div className="flex">
                  <div className="loader ease-linear rounded-full border-t-8 border-r-8 border-b-8 border-blue-500 h-12 w-12 mr-1 animate-spin"></div>
                </div>
              </div>
              
              ) : (<>
                {/* Titles Column */}
                <div className="col-span-4 h-80 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-2">Titles</h3>
                  {/* Render Titles List */}
                  <ul>
                    {projectData.title.map((title: string, index: number) => (
                      <li
                        key={index}
                        className={`rounded-md border border-gray-300 px-4 py-2 cursor-pointer transition duration-300 ${selectedTitleIdx === index ? 'bg-blue-500 text-white hover:bg-blue-700' : 'hover:bg-gray-200'}`}
                        onClick={() => handleTitleClick(index)}
                      >
                        {title}
                      </li>
                    ))}
                  </ul>
                </div>
  
                {/* Descriptions Column */}
                <div className="col-span-8 h-80 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-2">Descriptions</h3>
                  {/* Render Descriptions List */}
                  <ul>
                    {projectData.description.map((description: string, index: number) => (
                      <li
                        key={index}
                        className={`rounded-md border border-gray-300 px-4 py-2 cursor-pointer transition duration-300 ${selectedDescIdx === index ? 'bg-blue-500 text-white hover:bg-blue-700' : 'hover:bg-gray-200'}`}
                        onClick={() => handleDescClick(index)}
                      >
                        {description}
                      </li>
                    ))}
                  </ul>
                </div>
  
                {/* Buttons */}
                <div className="col-span-full flex justify-end">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => goToLogoPge()}
                  >
                    Next
                  </button>
                </div>
              </>
              )}
            </div>
          )}
  
          {step === 3 && (
            <div className="grid grid-cols-12 gap-4 w-90">
            <h2 className="col-span-full text-2xl font-semibold mb-3">Make Your Logo</h2>
          
            {/* Dropdowns and Input */}
            <div className="col-span-full grid grid-cols-5 gap-4 mb-4">
              <div className="col-span-3">
                <DropdownComponent label="Type" options={['', 'lettermark', 'mascot', 'emblem']} onSelectOption={setLogoType} />
                <DropdownComponent label="Artistic Technique" options={['', 'outline', 'gradient']} onSelectOption={setLogoArtTech} />
                <DropdownComponent label="Style" options={['', 'vector']} onSelectOption={setLogoStyle} />
                <DropdownComponent label="Specific Instruction" options={['', 'white on black background', 'black on white background']} onSelectOption={setLogoSpecInst} />
                <DropdownComponent label="Artistic Genre" options={['', 'abstract expressionism', 'crystal cubism', 'pop art']} onSelectOption={setLogoArtGenre} />
                <div className="pt-2">
                  <label>Famous Name</label>
                  <input
                    type="text"
                    placeholder="Leonardo Davinci"
                    className="border border-gray-300 p-2 rounded-md w-full"
                    value={logoFamousName}
                    onChange={(e) => setLogoFamousName(e.target.value)}
                  />
                </div>
              </div>
          
              {/* Image Viewer */}
              <div className="col-span-2 relative flex flex-col items-center justify-center">
                <button className="w-full h-12 bg-blue-500 p-2 text-white font-bold rounded" onClick={generateLogo}>
                  {logoLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    'Generate Logo'
                  )}
                </button>
                <div className="w-full h-60vh bg-gray-300 mt-4">
                  {/* ImageViewerComponent or placeholder */}
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                    <Image src={selectedLogo} alt="Image from DALL·E" width={600} height={600} />
                  </div>
                </div>
              </div>
            </div>
          
            {/* Buttons */}
            <div className="col-span-full flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => save(selectedTitle, selectedDesc, selectedLogo)}
              >
                Save
              </button>
            </div>
          </div>
          
          )}
        </div>
      </div>
    );
  };

export default Modal;