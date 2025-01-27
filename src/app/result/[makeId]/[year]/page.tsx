'use client';

import { Suspense, useEffect, useState } from 'react';
import { use } from 'react';

interface Vehicle {
  Model_ID: number;
  Model_Name: string;
}

export default function ResultPage({
  params,
}: {
  params: Promise<{ makeId: string; year: string }>;
}) {
  const { makeId, year } = use(params);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (makeId && year) {
      async function fetchVehicles() {
        const res = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
        );
        const data = await res.json();
        setVehicles(data.Results || []);
      }

      fetchVehicles();
    }
  }, [makeId, year]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-2 bg-gray-50 text-black'>
      <main className='flex flex-col items-center justify-center text-center p-6 max-w-md w-full'>
        <h1 className='text-3xl font-semibold mb-8'>
          Results for {makeId} {year}
        </h1>

        {/* List of Vehicles */}
        <Suspense fallback={<p>Loading vehicles...</p>}>
          <div className='w-full'>
            {vehicles.length === 0 ? (
              <p>No vehicles found for this make and year.</p>
            ) : (
              <ul>
                {vehicles.map((vehicle) => (
                  <li key={vehicle.Model_ID} className='mb-4'>
                    <div className='border p-4 rounded-lg'>
                      <h2 className='text-xl font-semibold'>
                        {vehicle.Model_ID}
                      </h2>
                      <p>Model: {vehicle.Model_Name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Suspense>
      </main>

      <footer className='mt-auto w-full text-center p-4 text-sm text-gray-500'>
        <p>&copy; by Kateryna Nikolaienko</p>
      </footer>
    </div>
  );
}
