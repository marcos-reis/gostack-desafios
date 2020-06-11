import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
  size: number;
  path: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function processUpload(uploadFile: FileProps): Promise<void> {
    const data = new FormData();
    data.append('file', uploadFile.file);

    try {
      await api.post('/transactions/import', data, {
        headers: {
          'x-device-id': 'stuff',
          'Content-Type': 'multipart/form-data',
        },
      });
      // history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  async function handleUpload(files: FileProps[]): Promise<void> {
    files.map(processUpload);
  }

  function submitFile(files: any): void {
    const newFiles = files.map((file: FileProps) => {
      return {
        file,
        readableSize: filesize(file.size),
        name: file.name,
        size: file.size,
        path: file.path,
      };
    });

    setUploadedFiles(newFiles);
    console.log(newFiles[0].file);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={() => handleUpload(uploadedFiles)} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
