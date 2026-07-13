import React, { useEffect , useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const images = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.immediate.co.uk/production/volatile/sites/30/2022/08/Corndogs-7832ef6.jpg?quality=90&resize=556,505',
  'https://www.truefoodkitchen.com/wp-content/uploads/2025/12/TrueFoodKitchenFall-01871-Edit_1200x800_2-1024x683.jpg'
]


const Home = () => {
  const { hash } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // this is for the image to change when it clicked and show the image after refreshing the page....

  const [currentImageIndex, setCurrentImage] = useState(() => {
    const saved = localStorage.getItem('images');
    return saved ? parseInt(saved , 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('images', currentImageIndex.toString());
  })

  const handleImageClick = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  }

  const handlePrimaryAction = (e) => {
    e.preventDefault();
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/orders');
      }
    } else {
      navigate('/login');
    }
  };

  const getPrimaryButtonText = () => {
    if (!user) return 'Order Now';
    return user.role === 'admin' ? 'Dashboard' : 'My Orders';
  };

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative rounded-xl bg-gradient-to-br from-amber-200 via-purple-300 to-indigo-30 pt-16 pb-32 flex items-center justify-center min-h-[80vh] overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-400 blur-3xl opacity-50 z-0"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-400 blur-3xl opacity-50 z-0"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-4 tracking-wide small-font">
              Fresh & Delicious
            </span>
            <h1 className="text-3xl text-shadow-lg sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-700 leading-tight mb-6 head2-font">
              Savor The <span className="para-font underline text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Perfect</span> Bite
            </h1>
            <p className="small-font text-md text-shadow-md md:text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
              Discover a world of flavors right at your fingertips. Order your favorite meals online and enjoy fast, reliable delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#"
                onClick={handlePrimaryAction}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg small-font shadow-orange-500/30 transition-all duration-[1s] hover:-translate-y-1 text-center"
              >
                {getPrimaryButtonText()}
              </a>
              <Link
                to="/customer/menu"
                className="bg-white border-2 border-gray-200 hover:border-orange-500 text-gray-500 hover:text-orange-500 shadow-lg/10 font-semibold small-font duration-[1s] font-semibold py-4 px-8 rounded-full transition-all text-center"
              >
                View Menu
              </Link>
            </div>
          </div>

          {/* Hero Image / Graphic */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-orange-400 rounded-[3rem] rotate-3 scale-105 z-0"></div>
            <img
              src={images[currentImageIndex]}
              onClick={handleImageClick}
              alt="Delicious healthy bowl"
              className="relative cursor-pointer z-10 rounded-[3rem] shadow-2xl object-cover h-[500px] w-full border-4 border-white"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <p className="font-bold text-gray-800 small-font">100% Fresh</p>
                <p className="text-sm text-gray-500 small-font">Ingredients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-amber-300 via-purple-300 to-indigo-300 rounded-xl">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4 head2-font text-shadow-md">Why Choose FoodHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto small-font">We're committed to bringing you the best dining experience, combining quality ingredients with exceptional service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-md transition-all duration-[1.5s] hover:-translate-y-2  border border-gray-100 text-center cursor-pointer">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-3 head2-font text-shadow-md">Fast Delivery</h3>
              <p className="text-gray-700 leading-relaxed small-font text-sm">Hot and fresh food delivered right to your doorstep in under 30 minutes. We value your time and hunger.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-md transition-all duration-[1.5s] hover:-translate-y-2  border border-gray-100 text-center cursor-pointer">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-3 head2-font text-shadow-md">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed text-sm small-font">We source only the freshest ingredients from local farmers. Quality you can taste in every single bite.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-md transition-all border border-gray-100 text-center cursor-pointer duration-[1.5s] hover:-translate-y-2 ">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-3 head2-font text-shadow-md">Made with Love</h3>
              <p className="text-gray-600 leading-relaxed text-sm small-font">Our passionate chefs pour their heart into every recipe, ensuring a memorable culinary experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 rounded-xl bg-gradient-to-br from-amber-300 via-purple-300 to-indigo-300">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto bg-orange-50 rounded-[3rem] p-8 md:p-16 text-center border border-orange-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-30 -ml-20 -mb-20"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-700 text-shadow-lg mb-6 head2-font">Get In Touch</h2>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto small-font text-md">
                Have questions about our menu, delivery, or want to partner with us? Our team is always ready to help you out.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <span className = " text-lg small-font">hello@foodhub.com</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <span className="font-semibold small-font text-lg">+977 9800988799</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
