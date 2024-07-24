import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import DropdownComponent from './dropdownComponent';
import { generateImage } from '@/utils/dalleAPI';
import Image from 'next/image';
import { generateText } from '../utils/openaiAPI';

interface ModalProps {
    show: boolean;
    onClose: () => void;
}
  

const WPModal: React.FC<ModalProps> = ({ show, onClose }) => {
    const [projectInfo, setProjectInfo] = useState<any>();
    
    const [sectionListItems, setSectionListItems] = useState<string[]>([]); //sections
    const [selectedSectionIdx, setSelectedSectionIdx] = useState<number | null>(null);
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [selectedSectionItem, setSelectedSectionItem] = useState<string>("");
    
    const [contentListItems, setContentListItems] = useState<any[]>([]); //contents
    const [selectedContentItemIdx, setSelectedContentItemIdx] = useState<number | null>(null);
    const [selectedContent, setSelectedContent] = useState<string[]>([]);
    const [spinner, setSpinner] = useState(false);
    
    // Initialize wpSectionFlag with false values (length: 10) using useState
    const [wpSectionFlag, setWpSectionFlag] = useState<boolean[]>(new Array(10).fill(false));

    // Initialize wpContentFlag with false values (length: 10x10) using useState
    const [wpContentFlag, setWpContentFlag] = useState<boolean[][]>(
        new Array(10).fill([]).map(() => new Array(10).fill(false))
    );


    let project_id = "";
    if (typeof window !== 'undefined') {
      // Your code that uses `window` object
      project_id = window.location.href.split("/project?")[1];
    }
    useEffect(() => {
        readData();
    }, [project_id]);
    
    useEffect(() => {
        if (projectInfo && projectInfo['title'] && projectInfo['description']) {
            generateSectCont(projectInfo['title'], projectInfo['description']);
          }
    }, [projectInfo]);
    
    const readData = async () => {
        try {
          const { data, error } = await supabase.from('test_projects').select('*').eq('id', project_id);
          if (error) {
            throw error;
          }
          if (data) {
            setProjectInfo(data[0]);
          }
        } catch (error) {
          console.error('Error reading data:', error);
        }
    };
    
    const handleSectionClick = (index: number) => {
        if (wpSectionFlag[index] === true) {
          setSelectedSectionIdx(null); // Unselect the item if it's already selected
          setSelectedSection("");
          // Get the current state of wpSectionFlag
          const updatedSectionFlag = [...wpSectionFlag]; // Create a new array copy
          updatedSectionFlag[index] = false;
          setWpSectionFlag(updatedSectionFlag);
        } else {
          setSelectedSectionIdx(index); // Select the clicked item
          setSelectedSection(sectionListItems[index])
          setSelectedContent(contentListItems[index])
          // Get the current state of wpSectionFlag
          const updatedSectionFlag = [...wpSectionFlag]; // Create a new array copy
          updatedSectionFlag[index] = true;
          setWpSectionFlag(updatedSectionFlag);
        }
      };
    
    const handleContentItemClick = (index: number) => {
    if (selectedSectionIdx !== null){
        if (wpContentFlag[selectedSectionIdx][index] == true) {
            setSelectedContentItemIdx(null); // Unselect the item if it's already selected
            setSelectedSectionItem("")
            // Get the current state of wpSectionFlag
            const updatedContentFlag = [...wpContentFlag]; // Create a new array copy
            updatedContentFlag[selectedSectionIdx][index] = false;
            setWpContentFlag(updatedContentFlag);
        } else {
            setSelectedContentItemIdx(index); // Select the clicked item
            setSelectedSectionItem(selectedContent[index])
            // Get the current state of wpSectionFlag
            const updatedContentFlag = [...wpContentFlag]; // Create a new array copy
            updatedContentFlag[selectedSectionIdx][index] = true;
            setWpContentFlag(updatedContentFlag);
        }
        // console.log(wpContentFlag)
    }
    };
    

    // Function to save the generated whitepaper
    const saveWhitepaper = () => {
        // Logic to save the generated whitepaper
      let wpData:string[] = []
      wpData.push(JSON.stringify(wpSectionFlag))  
      wpData.push(JSON.stringify(wpContentFlag))  
      wpData.push(JSON.stringify(sectionListItems))  
      wpData.push(JSON.stringify(contentListItems))  
    //   console.log(wpData)
      onClose();
      alert("Successfuly saved!")
    };

    // Function to generate a sections and contents
    const generateSectCont = async (title: string, description: string) => {
        // console.log("title&description", title, "&",description)
        setSpinner(true)
        let prompt=`Create 10 distinct sections and each 10 contents in each contentns separately on the project
                    which the title and description are '${title}' and '${description}'.
                    Display the result below type:
                    { 
                    sections: [
                       'this is the project that is called happy family',
                       'how to make a happy society',
                    ],
                    contents: [
                        ['this is the project that is called happy family',
                         'in this world we can make the world',
                         'this is the project that is what I made',
                        ],
                        ['this is the paradise where we live',
                         'this is the project that good friend',
                         'this is the project that is called happy factory',
                        ],
                    ]
                    }`
        // send a prompt
        const response: string | null = await generateText(prompt);
        let result = {sections:[], contents:[]}
        try {
          if(response !== null){
              // console.log(response)
              result = JSON.parse(response)
          }
        }
        catch (error:any) {
          console.error('An error occurred:', error.message);
        }
        // const sections = ['happy family', 'happy factory', 'happy family', 'happy factory', 'happy family', 'happy factory']
        // const contents = [[ 'this is the project that is called "happy family"',
        //                     'this is the project that is called "happy society"',
        //                     'this is the project that is called "happy factory"'],
        //                     ['qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"',
        //                      'this is the project that is called "happy society"',
        //                      'this is the project that is called "happy factory"',],
        //                      ['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"',
        //                       'this is the project that is called "happy society"',
        //                       'this is the project that is called "happy factory"',],
        //                       ['zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"',
        //                        'this is the project that is called "happy society"',
        //                        'this is the project that is called "happy factory"',],
        //                        ['aqaqaqaaqaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"',
        //                         'this is the project that is called "happy society"',
        //                         'this is the project that is called "happy factory"',],
        //                         ['xaxaxaxaxaxaxaxaxaxaxaxahat is called "happy family"',
        //                          'this is the project that is called "happy society"',
        //                          'this is the project that is called "happy factory"',]]
        setSectionListItems(result.sections);
        setContentListItems(result.contents);
        setSpinner(false)
    };
    
    
    return (
      <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${show ? '' : 'hidden'}`}>
        {/* Darkened overlay */}
        <div className={`fixed inset-0 bg-black opacity-50 ${show ? '' : 'hidden'}`}></div>
        
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-lg w-3/4">
            <h2 className="text-2xl font-semibold mb-3">Whitepaper Generator</h2>
            {spinner ? (
              <div className="flex items-center justify-center">
                <div className="loader ease-linear rounded-full border-t-8 border-r-8 border-b-8 border-blue-500 h-12 w-12 mr-1 animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {/* First scroll list */}
                <div className="col-span-1 h-80 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Section</h3>
                  <ul className="overflow-y-auto h-60">
                  {sectionListItems.map((item, idx) => (
                      <li
                          key={idx}
                          onClick={() => handleSectionClick(idx)}
                          className={`rounded-md border border-gray-300 px-4 py-2 cursor-pointer transition duration-300 ${wpSectionFlag[idx] === true ? 'bg-blue-500 text-white hover:bg-blue-700' : 'hover:bg-gray-200'}`}
                          >
                          {item}
                      </li>
                  ))}
                  </ul>
                </div>

                {/* Second scroll list */}
                <div className="col-span-1 h-80 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Content</h3>
                  <ul className="overflow-y-auto h-60">
                      {selectedContent.map((item, idx) => (
                          <li
                              key={idx}
                              onClick={() => handleContentItemClick(idx)}
                              className={`rounded-md border border-gray-300 px-4 py-2 cursor-pointer transition duration-300 ${selectedSectionIdx !== null && wpContentFlag[selectedSectionIdx][idx] === true ? 'bg-blue-500 text-white hover:bg-blue-700' : 'hover:bg-gray-200'}`}
                          >
                          {item}
                          </li>
                      ))}
                  </ul>
                </div>

                {/* Preview component */}
                <div className="col-span-1 h-80 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Preview</h3>
                  {/* Display content selected in both lists */}
                  <div className="overflow-y-auto h-60 border border-gray-300 p-3 ">
                    {wpSectionFlag.map((sectionFlag, i) => {
                        if (sectionFlag) {
                        return (
                            <div key={i}>
                                <h4 style={{ fontWeight: 'bold' }}>{sectionListItems[i]}</h4>
                                {wpContentFlag[i].map((contentFlag, j) => {
                                    if (contentFlag) {
                                        return <p key={j}>- {contentListItems[i][j]}</p>
                                    }
                                    return null; // Return null if content flag is false
                                })}
                            </div>
                        );
                        }
                        return null; // Return null if section flag is false
                    })}
                   </div>
                </div>
              </div>
            )}
            {/* Buttons */}
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={saveWhitepaper}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default WPModal;