'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

interface VehicleMake {
  MakeId: number;
  MakeName: string;
}

// Filter page
export default function Home() {
  const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>([]);
  const [makeId, setMakeId] = useState('');
  const [year, setYear] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // Fetch vehicle makes
  useEffect(() => {
    async function fetchMakes() {
      const res = await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
      );
      const data = await res.json();
      setVehicleMakes(data.Results);
    }

    fetchMakes();
  }, []);

  // Enable the button only when both make and year are selected
  useEffect(() => {
    if (makeId && year) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [makeId, year]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2014 },
    (_, index) => currentYear - index
  );

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-2 bg-gray-50 text-black'>
      <main className='flex flex-col items-center justify-center text-center p-6 max-w-md w-full'>
        <h1 className='text-3xl font-semibold mb-8'>Choose Car</h1>

        {/* Vehicle Make Dropdown */}
        <div className='mb-6 w-full text-left'>
          <label htmlFor='vehicleMake' className='block text-xl mb-2'>
            Select Vehicle Make
          </label>
          <Suspense fallback={<div>Loading vehicle makes...</div>}>
            <select
              id='vehicleMake'
              value={makeId}
              onChange={(e) => setMakeId(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Select a make</option>
              {vehicleMakes.map((make) => (
                <option key={make.MakeId} value={make.MakeId}>
                  {make.MakeName}
                </option>
              ))}
            </select>
          </Suspense>
        </div>

        {/* Model Year Dropdown */}
        <div className='mb-8 w-full text-left'>
          <label htmlFor='modelYear' className='block text-xl mb-2'>
            Select Model Year
          </label>
          <select
            id='modelYear'
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>Select a year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Next Button */}
        <Link
          href={isButtonEnabled ? `/result/${makeId}/${year}` : '#'}
          passHref
          className='w-full'
        >
          <button
            disabled={!isButtonEnabled}
            className={`px-6 py-2 text-white font-semibold rounded-lg w-full ${
              isButtonEnabled
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            } w-full`}
          >
            Next
          </button>
        </Link>
      </main>

      <footer className='absolute bottom-0 right-0 mb-4 mr-4 text-sm text-gray-500'>
        <p>&copy; by Kateryna Nikolaienko</p>
      </footer>
    </div>
  );
}
