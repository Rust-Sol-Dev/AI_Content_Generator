"use client"
import { readOneData } from '@/utils/supabaseClient';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import WPModal from '../../components/wpModal';
import MCModal from '../../components/mcModal';

const ProjectDetail: React.FC = () => {
  let project_id = "";
  if (typeof window !== 'undefined') {
    // Your code that uses `window` object
    project_id = window.location.href.split("/project?")[1];
  }
  const [showWPModal, setShowWPModal] = useState(false);
  const [showMCModal, setShowMCModal] = useState(false);
  const [projectInfo, setProjectInfo] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readOneData(parseInt(project_id)); // Assuming readAllData is an async function that returns a Promise
        if (data) {
          setProjectInfo(data);
        }
      } catch (error) {
        // Handle errors if any occurred during fetching or processing data
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData(); // Call the async function to fetch data
  }, [project_id]);

  const openWPModal = () => {
    setShowWPModal(true);
  };

  const closeWPModal = () => {
    setShowWPModal(false);
  };

  const openMCModal = () => {
    setShowMCModal(true);
  };

  const closeMCModal = () => {
    setShowMCModal(false);
  };

  return (
    <main className='p-24'>
      <Link href="/" className='rounded-[5px] py-2 px-4 bg-[#232353] text-white'>Back</Link>
      <div className="flex min-h-screen flex-col text-left gap-4 mt-[10px]">
        <div className='text-[48px]'>{projectInfo && projectInfo[0]['title']}</div>
        <div>
          <h1 className='text-[32px]'>Description:</h1>
          <div>{projectInfo && projectInfo[0]['description']}</div>
        </div>
        <div>
          <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={openWPModal}
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Create Whitepaper:{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Instantly create your Whitepaper.</p>
        </button>
        </div>
        <div>
          <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={openMCModal}
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Create Marketing Content:{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Instantly create your Marketing Content.</p>
        </button>
        </div>
      </div>
      <WPModal show={showWPModal} onClose={closeWPModal} />
      <MCModal show={showMCModal} onClose={closeMCModal} />
    </main>
  );
};

export default ProjectDetail;
