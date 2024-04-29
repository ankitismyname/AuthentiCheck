import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-200 to-blue-300 min-h-screen flex items-center justify-center">
      <div className="p-8">
        <h3 className="text-3xl font-bold text-center mb-6">Welcome to the Fake Product Identification System</h3>
        <div className="text-lg text-center text-gray-800 mb-8">
          <p>
            Welcome to our platform where transparency meets security. Our system allows both customers and members of registered companies to ensure the authenticity of products.
          </p>
          <p className="mt-4">
            <span className="font-bold">For Customers:</span> Easily verify the authenticity of a product by checking its presence in our system. Simply visit our{" "}
            <Link className="text-blue-500 hover:underline" to="verify">
              Verify Product page
            </Link>{" "}
            to get started.
          </p>
          <p className="mt-4">
            <span className="font-bold">For Members:</span> Take control of your company's product registry. As a member, you can:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Register products and create a customized smart contract for your company.</li>
            <li>Fetch all products associated with your company for easy management.</li>
            <li>Vote on adding new members to the platform, ensuring a secure community.</li>
            <li>View and manage all your registered products and nominations from one place.</li>
          </ul>
          <p className="mt-4">
            Ready to get started? Visit our{" "}
            <Link className="text-blue-500 hover:underline" to="getcontract">
              Fetch Address page
            </Link>{" "}
            to fetch organization products or explore our platform to learn more.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
