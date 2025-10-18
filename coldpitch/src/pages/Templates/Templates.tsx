import Navbar from '../../components/Navbar/Navbar';

export default function Templates() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Templates" onNewCampaign={() => console.log('Create template')} />
      <div className="p-6">
        <div className="bg-white rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Templates Page</h2>
          <p className="text-gray-500 mt-2">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
