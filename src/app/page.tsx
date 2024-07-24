"use client"
import { readAllData } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import DataTable from '../components/datatable';
import Modal from '../components/modal';


const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [projectList, setProjectList] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readAllData(); // Assuming readAllData is an async function that returns a Promise
        if (data) {
          setProjectList(data);
        }
      } catch (error) {
        // Handle errors if any occurred during fetching or processing data
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData(); // Call the async function to fetch data
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const columns = ['ID', 'Title', 'Description', 'LogoUrl'];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={openModal}
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Create{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Instantly create your project title and description.</p>
        </button>
      </div>
      {/* Display DataTable */}
      <DataTable data={projectList} columns={columns} />

      <Modal show={showModal} onClose={closeModal} />
    </main>
  );
};






export default Home;
