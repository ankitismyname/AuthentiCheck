import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-200 to-blue-300 min-h-screen flex flex-col items-center justify-center">
      <div className="p-8">
        <h3 className="text-3xl font-bold text-center mb-6">Welcome to the Fake Product Identification System</h3>
        <div className="text-lg text-center text-gray-800 mb-8">
          <p>
            Welcome to our platform where transparency meets security. Our system allows both customers and members of registered companies to ensure the authenticity of products.
          </p>
          <p className="mt-4">
            <span className="font-bold">For Customers:</span> Easily verify the authenticity of a product by checking its presence in our system. Simply visit our{" "}
            <Link className="text-blue-500 hover:underline" to="/VerifyProducts">
              Verify Product page
            </Link>{" "}
            to get started.
          </p>
          <p className="mt-4">
            <span className="font-bold">For Manufacturers:</span> Register products, generate unique QR codes for product instances, and manage your product contracts.
          </p>
          <p className="mt-4">
            <span className="font-bold">For Suppliers:</span> Verify and receive products, and add them to the main blockchain for authentication.
          </p>
          <p className="mt-4">
            Ready to get started? Visit our{" "}
            <Link className="text-blue-500 hover:underline" to="/GetAllThings">
              Fetch Address page
            </Link>{" "}
            to fetch organization products or explore our platform to learn more.
          </p>
          <p className="mt-4">
            Interested in voting for new members? Head over to the{" "}
            <Link className="text-blue-500 hover:underline" to="/VotingMembersList">
              Organization Voting page
            </Link>{" "}
            to participate.
          </p>
        </div>
      </div>
      {/* Updated Copyright statement */}
      <div className="flex items-center justify-center text-gray-600">
        <span className="mr-1">&copy;</span> 2024 All rights reserved by AuthentiCheck, Inc.
      </div>
    </div>
  );
}

export default Home;
