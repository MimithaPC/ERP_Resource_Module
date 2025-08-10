function Footer() {

    return (

        <div className="w-full bg-gray-800e py-8 text-left text-blue-300">

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          
                    {/* Company Info */}
                <div className="pr-10">
                    <h2 className="text-xl font-bold mb-2 underline">ERP Building Construction Sri Lanka</h2>
                    <p className="text-sm">
                    Empowering Sri Lanka’s construction industry with innovative ERP solutions that enhance project management, cost control, and operational efficiency.
                </p>
                </div>
  
                    {/* Quick Links */}
                <div className="pl-28">
                    <h3 className="text-lg font-semibold mb-2 underline">Quick Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/" className="hover:underline hover:text-blue-600">Home</a></li>
                        <li><a href="/about" className="hover:underline hover:text-blue-600">About Us</a></li>
                        <li><a href="/contact" className="hover:underline hover:text-blue-600">Contact Us</a></li>
                        <li><a href="/features" className="hover:underline hover:text-blue-600">Features</a></li>
                        <li><a href="/reviews" className="hover:underline hover:text-blue-600">Reviews</a></li>
                        <li><a href="/projects" className="hover:underline hover:text-blue-600">Projects</a></li>   
                    </ul>
                </div>
  
                    {/* Contact Info */}
                <div className="pl-28">
                    <h3 className="text-lg font-semibold mb-2 underline">Contact Us</h3>
                    <p className="text-sm">No. 45, Lotus Road, Colombo 01</p>
                    <p className="text-sm">Western Province, Sri Lanka</p>
                    <p className="text-sm">Phone: <h1 className="hover:text-blue-600">+94 11 234 5678</h1></p>
                    <p className="text-sm">Email: <h1 className="hover:text-blue-600">support@buildwise.lk</h1></p>
                </div>
  
            </div>
  
            <div className="text-center text-xs mt-8 border-t border-blue-700 pt-4">
                &copy; {new Date().getFullYear()} ERP Building Construction. All rights reserved.
            </div>

        </div>

    );

  }
  
  export default Footer;
  