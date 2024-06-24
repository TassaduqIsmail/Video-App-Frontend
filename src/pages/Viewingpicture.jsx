import React from 'react';

function Viewingpicture() {
  return (
    <div className='w-full h-full' >
        <img src='https://images.pexels.com/photos/433989/pexels-photo-433989.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' />
      <div className='flex justify-between m-2 absolute top-0'>
        <img src="backicon.png" alt="" />
      </div>
      <div className='p-5'>
        {/* Content goes here */}
      </div>
      
      <div id="drawer-bottom-example" class="fixed bottom-0 left-0 right-0 z-40 w-full p-4 overflow-y-auto transition-transform bg-[#110e0f] dark:bg-gray-800 transform-none" tabindex="-1" aria-labelledby="drawer-bottom-label">
        <div className='flex justify-between mb-1 p-2'>
          <p className='text-white flex justify-center items-center'><img src="heart.png" alt="" /> 14K</p>
          <p className='text-white flex justify-center items-center'><img src="play.png" alt="" /> 1.6M</p>
          <p className='text-white flex justify-center items-center'><img src="star.png" alt="" /> 4.5</p>
        </div>
      </div>
    </div>
  );
}

export default Viewingpicture;
