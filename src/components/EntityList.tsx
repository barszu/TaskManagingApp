import React, { useEffect, useState } from 'react';

const EntityList = () => {
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entitiesPerPage] = useState(10);

    useEffect(() => {
        const fetchEntities = async () => {
            const response = await fetch('/api/entities');
            const data = await response.json();
            setEntities(data);
            setLoading(false);
        };

        fetchEntities();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredEntities = entities.filter(entity =>
        entity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastEntity = currentPage * entitiesPerPage;
    const indexOfFirstEntity = indexOfLastEntity - entitiesPerPage;
    const currentEntities = filteredEntities.slice(indexOfFirstEntity, indexOfLastEntity);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search entities..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <ul>
                {currentEntities.map(entity => (
                    <li key={entity._id}>
                        {entity.name} - {entity.value} - {entity.isActive ? 'Active' : 'Inactive'}
                    </li>
                ))}
            </ul>
            <div>
                {Array.from({ length: Math.ceil(filteredEntities.length / entitiesPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EntityList;