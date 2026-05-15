import React from 'react'
import { EvCharger, Rabbit, Sprout, MapPinSearch, User, Activity, Search, Save } from 'lucide-react';
import Sidebar from './component/sidebar';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    // icon and dummy navbar
    <div className='m-6 max-w-375'>
        <div className='flex max-w-[7xl] items-center justify-between'>
            <img className="w-45" src="src/Assests/ChargeFlow.png" alt="chargeflow" />
            <Sidebar />
            <Link 
                to="/profile"
                className="bg-green-500 p-2 text-lg font-bold text-white rounded-xl shadow-lg cursor-pointer hover:bg-green-700"
            >
                Sign Up
            </Link>           
        </div>

        <section>
            {/* Title and slogan */}
            <div className='flex flex-col gap-4 pb-4'>           
                <h1 className='text-6xl font-bold w-150'>Powering your journey, <span className='text-green-500'>{" "}sustainably</span></h1>
                <p className='text-2xl'>Find the nearest station: <span className='font-bold text-gray-500'>{" "}Charge, Pay, Flow</span> </p>   
            </div>

            <div className='flex flex-col mt-2'>
                    {/* Navigation to map */}
                <div >
                    <Link 
                        to="/findcharger" 
                        className='bg-green-500 p-2 text-white rounded-xl font-bold cursor-pointer hover:bg-green-700'
                    >
                        Find Charging Station
                    </Link>
                </div>

                {/* statistics */}
                <div className='flex gap-30 items-center'>
                    <div className='flex gap-10'>
                        <div className='flex flex-col gap-2'>
                            <EvCharger size={30} className='text-green-500'/>
                            <h2 className='font-bold text-3xl'>2,450+</h2>
                            <p className='text-lg'>Charging Station</p>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <User size={30} className='text-green-500'/>
                            <h2 className='font-bold text-3xl'> 10k+</h2>
                            <p className='text-lg'>Happy Users</p>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Activity size={30} className='text-green-500'/>
                            <h2 className='font-bold text-3xl'>97%</h2>
                            <p className='text-lg'>Uptime</p>
                        </div>

                    </div>

                    {/* charging station image */}
                    <div className='image'>
                        <img 
                            className="w-250 rounded-l-xl h-150 object-cover mask-l-from-75% mask-t-from-90% " 
                            src="https://images.unsplash.com/photo-1703860271509-b50f5679f2a0?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="charhing station" />
                    </div>
                </div>

            </div>

        </section>       

        {/*why choose chargeflow  */}
        <div className='my-8 flex justify-center align-center gap-1 font-bold pt-3'>
            <div className='h-px flex-1 bg-gray-400 '></div>
            <h3 className='text-3xl'>Why Choose Chargeflow?</h3>
            <div className='h-px flex-1 bg-gray-400'></div>
        </div>
        
        <div className='process flex gap-4 justify-center'>
            <div className='find-chargers flex flex-col border p-4 w-90 h-50 gap-2 border-gray-300 shadow-lg'>
                <MapPinSearch size={30} className='text-green-500'/>
                <h6 className='font-bold text-2xl '>Find Chargers</h6>
                <p className='text-gray-500'>Locate a charging station near you</p>
            </div>
            <div className='fast-easy flex flex-col border p-4 w-90 h-50 gap-2 border-gray-300 shadow-lg'>
                <Rabbit size={30} className='text-green-500'/>
                <h6 className='font-bold text-2xl'>Fast & Easy</h6>
                <p className='text-gray-500'>Quick access seamless flow</p>
            </div>
            <div className='save-money flex flex-col border p-4 w-90 h-50 gap-2 border-gray-300 shadow-lg'>
                <Save size={30} className='text-green-500'/>
                <h6 className='font-bold text-xl'>Save Money</h6>
                <p className='text-gray-500'>Competitive Pricing and exclusive offers</p>
            </div>
            <div className='GoGreen flex flex-col border p-4 w-90 h-50 gap-2 border-gray-300 shadow-lg'>
                <Sprout size={30} className='text-green-500'/>
                <h6 className='font-bold text-2xl'>Go Green</h6>
                <p className='text-gray-500'>Contribute to a cleaner and greener planet</p>
             </div>
        </div>           
        
    </div>
  )
}

export default Dashboard