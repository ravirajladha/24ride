import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for ES Modules to get `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load stateCity.json file from the correct location
const stateCityFilePath = path.resolve(__dirname, '../../utils/stateCity.json');

const readStateCityData = () => {
  try {
    const data = fs.readFileSync(stateCityFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading stateCity.json: ${error.message}`);
    throw error;
  }
};

// Get all states
export const getAllStates = async (req, res) => {
  try {
    const data = readStateCityData();
    const states = data.states.map((s) => s.state);
    res.status(200).json({
      success: true,
      data: states,
      message: 'States fetched successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get cities for a specific state
export const getCitiesForState = async (req, res) => {
  try {
    const stateParam = req.params.state;
    const data = readStateCityData();

    const stateData = data.states.find((s) => s.state.toLowerCase() === stateParam.toLowerCase());

    if (!stateData) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }

    res.status(200).json({
      success: true,
      data: stateData.cities,
      message: `Cities for ${stateParam} fetched successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
