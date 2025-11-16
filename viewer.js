import React, { useState, useEffect } from 'react';
import { Search, User, Phone, Calendar, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const AttendanceViewer = () => {
  const [cardId, setCardId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const REQUIRED_PERCENT = 80;

  // Your actual CSV data
  const DATABASE = `student_id,card_id,name,date,attended,phone
S001,744920,Sasith Geevinda,1/15/2025,1,18777804236
S002,2026244,Nimesh Silva,1/15/2025,1,18777804236
S003,1922654,Amaya Perera,1/15/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/15/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/15/2025,1,18777804236
S001,744920,Sasith Geevinda,1/16/2025,0,18777804236
S002,2026244,Nimesh Silva,1/16/2025,1,18777804236
S003,1922654,Amaya Perera,1/16/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/16/2025,0,18777804236
S005,2068183,Tharushi Jayasinghe,1/16/2025,1,18777804236
S001,744920,Sasith Geevinda,1/17/2025,0,18777804236
S002,2026244,Nimesh Silva,1/17/2025,1,18777804236
S003,1922654,Amaya Perera,1/17/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/17/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/17/2025,0,18777804236
S001,744920,Sasith Geevinda,1/20/2025,1,18777804236
S002,2026244,Nimesh Silva,1/20/2025,1,18777804236
S003,1922654,Amaya Perera,1/20/2025,0,18777804236
S004,2027310,Kavinda Fernando,1/20/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/20/2025,0,18777804236
S001,744920,Sasith Geevinda,1/21/2025,1,18777804236
S002,2026244,Nimesh Silva,1/21/2025,0,18777804236
S003,1922654,Amaya Perera,1/21/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/21/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/21/2025,1,18777804236
S001,744920,Sasith Geevinda,1/22/2025,1,18777804236
S002,2026244,Nimesh Silva,1/22/2025,1,18777804236
S003,1922654,Amaya Perera,1/22/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/22/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/22/2025,1,18777804236
S002,2026244,Nimesh Silva,1/23/2025,1,18777804236
S003,1922654,Amaya Perera,1/23/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/23/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/23/2025,1,18777804236
S001,744920,Sasith Geevinda,1/24/2025,1,18777804236
S002,2026244,Nimesh Silva,1/24/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/24/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/24/2025,1,18777804236
S001,744920,Sasith Geevinda,1/27/2025,1,18777804236
S002,2026244,Nimesh Silva,1/27/2025,1,18777804236
S003,1922654,Amaya Perera,1/27/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/27/2025,1,18777804236
S001,744920,Sasith Geevinda,1/28/2025,1,18777804236
S002,2026244,Nimesh Silva,1/28/2025,1,18777804236
S003,1922654,Amaya Perera,1/28/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/28/2025,1,18777804236
S001,744920,Sasith Geevinda,1/29/2025,1,18777804236
S002,2026244,Nimesh Silva,1/29/2025,1,18777804236
S003,1922654,Amaya Perera,1/29/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/29/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/29/2025,1,18777804236
S001,744920,Sasith Geevinda,1/30/2025,1,18777804236
S003,1922654,Amaya Perera,1/30/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/30/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/30/2025,1,18777804236
S001,744920,Sasith Geevinda,1/31/2025,1,18777804236
S002,2026244,Nimesh Silva,1/31/2025,1,18777804236
S003,1922654,Amaya Perera,1/31/2025,1,18777804236
S004,2027310,Kavinda Fernando,1/31/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,1/31/2025,1,18777804236
S001,744920,Sasith Geevinda,2/3/2025,1,18777804236
S002,2026244,Nimesh Silva,2/3/2025,1,18777804236
S003,1922654,Amaya Perera,2/3/2025,1,18777804236
S004,2027310,Kavinda Fernando,2/3/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,2/3/2025,1,18777804236
S001,744920,Sasith Geevinda,2/4/2025,1,18777804236
S002,2026244,Nimesh Silva,2/4/2025,1,18777804236
S003,1922654,Amaya Perera,2/4/2025,1,18777804236
S004,2027310,Kavinda Fernando,2/4/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,2/4/2025,1,18777804236
S001,744920,Sasith Geevinda,2/5/2025,1,18777804236
S002,2026244,Nimesh Silva,2/5/2025,1,18777804236
S003,1922654,Amaya Perera,2/5/2025,1,18777804236
S004,2027310,Kavinda Fernando,2/5/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,2/5/2025,1,18777804236
S001,744920,Sasith Geevinda,2/6/2025,1,18777804236
S002,2026244,Nimesh Silva,2/6/2025,1,18777804236
S003,1922654,Amaya Perera,2/6/2025,1,18777804236
S004,2027310,Kavinda Fernando,2/6/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,2/6/2025,1,18777804236
S001,744920,Sasith Geevinda,2/7/2025,1,18777804236
S002,2026244,Nimesh Silva,2/7/2025,1,18777804236
S003,1922654,Amaya Perera,2/7/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,2/7/2025,1,18777804236
S001,744920,Sasith Geevinda,2/10/2025,1,18777804236
S002,2026244,Nimesh Silva,2/10/2025,1,18777804236
S003,1922654,Amaya Perera,2/10/2025,1,18777804236
S004,2027310,Kavinda Fernando,2/10/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,2/10/2025,1,18777804236
S001,744920,Sasith Geevinda,2/11/2025,1,18777804236
S003,1922654,Amaya Perera,2/11/2025,1,18777804236
S004,2027310,Kavinda Fernando,2/11/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,2/11/2025,1,18777804236
S001,744920,Sasith Geevinda,2/12/2025,1,18777804236
S002,2026244,Nimesh Silva,2/12/2025,1,18777804236
S003,1922654,Amaya Perera,2/12/2025,1,18777804236
S004,2027310,Kavinda Fernando,2/12/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,2/12/2025,1,18777804236
S001,744920,Sasith Geevinda,2/13/2025,1,18777804236
S002,2026244,Nimesh Silva,2/13/2025,1,18777804236
S003,1922654,Amaya Perera,2/13/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,2/13/2025,1,18777804236
S002,2026244,Nimesh Silva,11/8/2025,1,18777804236
S001,744920,Sasith Geevinda,11/9/2025,1,18777804236
S002,2026244,Nimesh Silva,11/9/2025,1,18777804236
S003,1922654,Amaya Perera,11/9/2025,1,18777804236
S004,2027310,Kavinda Fernando,11/9/2025,1,18777804236
S005,2068183,Tharushi Jayasinghe,11/9/2025,1,18777804236
S002,2026244,Nimesh Silva,11/9/2025,Late,18777804236
S001,744920,Sasith Geevinda,11/10/2025,Late,18777804236
S001,744920,Sasith Geevinda,11/11/2025,Late,18777804236
S001,744920,Sasith Geevinda,11/13/2025,Late,18777804236
S001,744920,Sasith Geevinda,2025-11-14,0,18777804236
S002,2026244,Nimesh Silva,2025-11-14,0,18777804236
S003,1922654,Amaya Perera,2025-11-14,0,18777804236
S004,2027310,Kavinda Fernando,2025-11-14,0,18777804236
S005,2068183,Tharushi Jayasinghe,2025-11-14,0,18777804236`;

  // Load data on mount
  useEffect(() => {
    loadCSVData();
  }, []);

  const loadCSVData = () => {
    parseCSV(DATABASE);
    setLastUpdated(new Date());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadCSVData();
      setRefreshing(false);
    }, 500);
  };

  const parseCSV = (content) => {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = values[i];
      });
      // Remove leading zeros from card_id
      obj.card_id = obj.card_id.replace(/^0+/, '');
      return obj;
    });
    
    setCsvData(data);
  };

  const handleSearch = () => {
    setError('');
    setLoading(true);
    
    // Remove leading zeros from input
    const cleanedId = cardId.trim().replace(/^0+/, '');
    
    if (!cleanedId) {
      setError('Please enter a valid Card ID');
      setLoading(false);
      return;
    }

    // Filter records for this card_id
    const records = csvData.filter(row => row.card_id === cleanedId);
    
    if (records.length === 0) {
      setError(`Student with Card ID '${cardId}' not found!`);
      setStudentData(null);
      setLoading(false);
      return;
    }

    // Calculate stats
    const total = records.length;
    const attended = records.filter(r => 
      r.attended === '1' || r.attended.toLowerCase() === 'late'
    ).length;
    const percentage = (attended / total) * 100;

    // Sort history by date descending
    const history = records.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

    setStudentData({
      name: records[0].name,
      student_id: records[0].student_id,
      phone: records[0].phone,
      total,
      attended,
      percentage,
      history
    });
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusDisplay = (status) => {
    if (status === '1') return 'Attended';
    if (status === '0') return 'Absent';
    return status;
  };

  const getRiskLevel = () => {
    if (!studentData) return { text: 'N/A', color: 'text-gray-500' };
    if (studentData.percentage < REQUIRED_PERCENT) {
      return { text: 'High Risk', color: 'text-red-600' };
    }
    return { text: 'Low Risk', color: 'text-blue-600' };
  };

  const risk = getRiskLevel();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">Student Attendance</h1>
            <p className="text-blue-100 text-sm mt-1">Profile Viewer</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
        {lastUpdated && (
          <p className="text-center text-blue-100 text-xs mt-2">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-gray-700 font-semibold mb-3">
            Enter Card ID:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 744920"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg text-center"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:bg-gray-400"
            >
              <Search size={20} />
              Search
            </button>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Profile Section */}
        {studentData && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User size={24} className="text-blue-600" />
                Student Profile
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Name:</p>
                  <p className="text-lg font-bold text-blue-600">{studentData.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Student ID:</p>
                  <p className="text-lg font-bold text-blue-600">{studentData.student_id}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Phone:</p>
                    <p className="text-lg font-bold text-blue-600">{studentData.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={24} className="text-blue-600" />
                Attendance Statistics
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Attendance %</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {studentData.percentage.toFixed(1)}%
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Days Attended</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {studentData.attended}/{studentData.total}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-1">Risk Level</p>
                <div className="flex items-center justify-center gap-2">
                  {risk.text === 'High Risk' ? (
                    <AlertCircle size={24} className="text-red-600" />
                  ) : (
                    <CheckCircle size={24} className="text-blue-600" />
                  )}
                  <p className={`text-2xl font-bold ${risk.color}`}>
                    {risk.text}
                  </p>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Attendance History
              </h2>
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Date</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.history.map((record, idx) => (
                        <tr 
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                        >
                          <td className="px-4 py-3 text-gray-700">{record.date}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              record.attended === '1' 
                                ? 'bg-green-100 text-green-800' 
                                : record.attended.toLowerCase() === 'late'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {getStatusDisplay(record.attended)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Info Message when no data */}
        {!studentData && !error && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg text-center">
            <p className="font-semibold">Enter a Card ID to view student profile</p>
            <p className="text-sm mt-2">Available Card IDs:</p>
            <p className="text-sm font-mono">744920, 2026244, 1922654, 2027310, 2068183</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceViewer;              