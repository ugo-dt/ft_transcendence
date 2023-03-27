// Rankings page
//
// Users should be able to:
//  See the top players (and their profile)
//
//  See their current ranking

import React from "react";

import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

const placeholder = [
  {
    id: 0,
    rank: 3,
    nickname: "Quentin",
    points: 345
  },
  {
    id: 1,
    rank: 1,
    nickname: "Sarah",
    points: 2554
  },
  {
    id: 2,
    rank: 4,
    nickname: "Antoine",
    points: 1
  },
  {
    id: 3,
    rank: 2,
    nickname: "Marie",
    points: 654
  },
];

function Rankings() {
  placeholder.sort((a, b) => a.rank - b.rank);
  return (
    <Container maxWidth="md">
      <TableContainer component={Paper} sx={{mt: 10}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Rank</TableCell>
              <TableCell align="center">Nickname</TableCell>
              <TableCell align="center">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {placeholder.map(item => {
              return (
                <TableRow key={item.id}>
                  <TableCell align="center">{item.rank}</TableCell>
                  <TableCell align="center">{item.nickname}</TableCell>
                  <TableCell align="center">{item.points}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Rankings;