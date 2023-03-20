import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export const api = axios.create({
  baseURL: 'https://api.github.com/search',
});

const App = () => {
  const [list, setList] = useState<string[]>([]);
  const [reactResults, setReactResults] = useState<number>(0);
  const [nodeResults, setNodeResults] = useState<number>(0);
  const [angularResults, setAngularResults] = useState<number>(0);

  useEffect(() => {
    console.log(list, 'list');
  }, [list]);

  const addToList = (q: string) => {
    const timestamp = new Date().toLocaleString();
    const text = `${q} - ${timestamp}`;

    const newList = [...list, text];
    setList(newList);
    console.log(text, 'add');

    return text;
  };

  const removeFromList = (text: string) => {
    const newList = list.filter((item) => item !== text);

    setList(newList);
    console.log(`should remove ${text}`);
  };

  const handleCallApi = useCallback(
    async (q: string) => {
      const text = addToList(q);

      try {
        const response = await api.get('/repositories', { params: { q } });
        return response.data.total_count;
      } catch (error) {
        console.error(error);
      } finally {
        removeFromList(text);
      }
    },
    [list]
  );

  const handleNodeResults = useCallback(async () => {
    setNodeResults(await handleCallApi('node'));
  }, []);

  const handleReactResults = useCallback(async () => {
    setReactResults(await handleCallApi('react'));
  }, []);

  const handleAngularResults = useCallback(async () => {
    setAngularResults(await handleCallApi('angular'));
  }, []);

  const fireApiCalls = useCallback(async () => {
    handleNodeResults();
    handleReactResults();
    handleAngularResults();
  }, []);

  return (
    <div>
      <button type="button" onClick={() => fireApiCalls()}>
        Call Api
      </button>

      <h1>Obrigado Aru, seu lindo! :)</h1>
      <p>
        <strong>Node: </strong>
        {nodeResults.toString()}
      </p>
      <p>
        <strong>React: </strong>
        {reactResults.toString()}
      </p>
      <p>
        <strong>Angular: </strong>
        {angularResults.toString()}
      </p>
    </div>
  );
};

export default App;
