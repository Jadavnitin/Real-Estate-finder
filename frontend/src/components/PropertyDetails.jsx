import { useParams } from 'react-router-dom';

const PropertyDetail = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Property Details for ID: {id}</h1>
    </div>
  );
};

export default PropertyDetail;