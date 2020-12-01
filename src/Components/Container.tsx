import React, {useEffect, useState, useCallback} from 'react';
import {Loader, Dimmer, Segment, Header, Icon, Label, Divider, Grid, List, Button} from 'semantic-ui-react';
import Table from './Table';

const {ipcRenderer} = window.require('electron');

interface TUser {
  code?: TError[];
  dni?: TError[];
  address?: TError[];
  phone?: TError[];
  birthDate?: TError[];
  age?: TError[];
  grade?: TError[];
  name?: TError[];
  lastname?: TError[];
  email?: TError[];
}

interface TError {
  errorName: string;
  count: number;
}

const sortObjectEntries = (obj: any) => {
  return  Object.entries(obj).sort((a,b)=>b[1]-a[1]).map(el=>el[0])
}

export default function Container() {
  const [data, setData] = useState({
    passing: [],
    failing: [],
  });

  const [mostFailureSorted, setMostFailureSorted] = useState<any>({});

  const [mostFailureRaw, setMostFailureRaw] = useState<any>({});

  const [tableData, setTableData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const getMostFailure = (_data: any) => {
    const failures: TUser = {
      address: [],
      age: [],
      birthDate: [],
      code: [],
      dni: [],
      email: [],
      grade: [],
      lastname: [],
      name: [],
      phone: [],
    }

    _data.failing.map(user => {
      user.missingProps.map(({propName, error}: {propName: keyof TUser; error: keyof TError}) => {
        if (propName) {
          if (!failures[propName]?.find((user) => user.errorName === error)) {
            failures[propName]?.push({
              errorName: error,
              count: 0
            })
          } else {
            const currentSum: number | undefined = failures[propName]?.find((user) => user.errorName === error)?.count;
            failures[propName]?.find((user) => user?.errorName === error)?.count = currentSum as number + 1;
          }
        }
      })
    });
    return failures;
  }

  const handleAsyncData = useCallback((event, arg) => {
    setData(arg);
    setTableData([
      {
        name: 'Datos',
        válidos: arg.passing.length,
        inválidos: arg.failing.length
      }
    ]);
    setMostFailureRaw(getMostFailure(arg));
    setMostFailureSorted(sortObjectEntries(getMostFailure(arg)));
    console.log(arg);
    setLoading(false);
  }, [])


  useEffect(() => {
    setLoading(true);
    ipcRenderer.send('data');

    ipcRenderer.on('data-replay', handleAsyncData);

    console.log(data);

    return (): void => {
      ipcRenderer.removeAllListeners('data-replay');
    };
  }, [handleAsyncData]);

  return (
    <>
      {
        loading ?
          <>
            <Dimmer active={true}>
              <Loader active={true} size='massive'>Análizando datos ...</Loader>
            </Dimmer>
          </> :
          <Grid centered columns={2} textAlign='center'>
            <Grid.Row verticalAlign='middle'>
              <Grid.Column verticalAlign='middle'>
                <Header as='h1' inverted>
                  <Icon name='line graph'/>
                  <Header.Content>
                    Análisis de Datos
                    <Header.Subheader>Escuela Politécnica Nacional</Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Label as='p' image style={{marginRight: '15px', marginBottom: '15px'}}>
                  <Icon name='database'/>
                  {data.passing.length + data.failing.length}
                  <Label.Detail>
                    Datos analizados
                  </Label.Detail>
                </Label>
                <Label as='p' image color='green' style={{marginRight: '15px', marginBottom: '15px'}}>
                  <Icon name='check'/>
                  {data.passing.length}
                  <Label.Detail>
                    Datos válidos
                  </Label.Detail>
                </Label>

                <Label as='p' image color='red' style={{marginRight: '15px', marginBottom: '15px'}}>
                  <Icon name='warning sign'/>
                  {data.failing.length}
                  <Label.Detail>
                    Datos en conflicto
                  </Label.Detail>
                </Label>
              </Grid.Column>
              <Divider/>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Table data={tableData}/>
              </Grid.Column>
              <Grid.Column>
                <Segment inverted>
                  <Header as='h3'>Campos con más fallos</Header>
                  <Segment inverted>
                    <List divided inverted relaxed animated>
                      {
                        Object.values(mostFailureSorted).map((obc) => {
                          if(mostFailureRaw[obc as string] === 0 || mostFailureRaw[obc as string].length === 0) {
                            return <div></div>
                          }
                          return (
                          <List.Item key={obc as string}>
                            <List.Icon color='red' name='warning circle' inverted  size='large' verticalAlign='middle'/>
                            <List.Content>
                              <List.Header>{obc as string}</List.Header>
                            Errores:<br />
                            {mostFailureRaw[obc as string].map(err => (
                              <List.Description><i>{err.errorName}</i> : <span style={{color: '#BB463B'}}>{err.count + 1}</span></List.Description>
                              ))}
                            </List.Content>
                          </List.Item>
                          )
                        })
                      }
                    </List>
                  </Segment>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
      }
    </>
  )
}