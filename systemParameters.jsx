import { useState } from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'

const TABS = [
  'Effort Driver',
  'FP/SP per Work Item',
  'Support Costs',
  'Shared Services & Delivery Management Costs',
  'Vendor PS Rates',
]

const INITIAL_ROWS = [
  { id: 1, item: 'SIT Support', value: '15%', sdmSplit: '30%', psSplit: '70%' },
  { id: 2, item: 'UAT Support', value: '10%', sdmSplit: '30%', psSplit: '70%' },
  { id: 3, item: 'Production Implementation Support', value: '5%', sdmSplit: '30%', psSplit: '70%' },
  { id: 4, item: 'Warranty Support', value: '5%', sdmSplit: '30%', psSplit: '70%' },
]

let nextId = 5

export default function SystemParameters({ readOnly = false }) {
  const [methodology, setMethodology] = useState('Waterfall')
  const [activeTab, setActiveTab] = useState(2) // "Support Costs"
  const [rows, setRows] = useState(INITIAL_ROWS)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})

  const filtered = rows.filter((r) =>
    Object.values(r).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  )

  function handleAdd() {
    const newRow = { id: nextId++, item: 'New Item', value: '0%', sdmSplit: '0%', psSplit: '0%' }
    setRows((prev) => [...prev, newRow])
    setEditingId(newRow.id)
    setEditValues({ item: newRow.item, value: newRow.value, sdmSplit: newRow.sdmSplit, psSplit: newRow.psSplit })
  }

  function handleDelete(id) {
    setRows((prev) => prev.filter((r) => r.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function handleEditStart(row) {
    setEditingId(row.id)
    setEditValues({ item: row.item, value: row.value, sdmSplit: row.sdmSplit, psSplit: row.psSplit })
  }

  function handleEditSave(id) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...editValues } : r)))
    setEditingId(null)
  }

  function handleEditCancel() {
    // If cancelling a brand-new row that hasn't been saved yet, remove it
    const row = rows.find((r) => r.id === editingId)
    if (row && row.item === 'New Item' && row.value === '0%') {
      setRows((prev) => prev.filter((r) => r.id !== editingId))
    }
    setEditingId(null)
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 5, px: 3, pb: 8 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Sample Parameters Screen
      </Typography>

      {/* Methodology dropdown */}
      <FormControl size="small" sx={{ width: 180, mb: 3 }}>
        <InputLabel>Select Methodology</InputLabel>
        <Select
          value={methodology}
          label="Select Methodology"
          onChange={(e) => !readOnly && setMethodology(e.target.value)}
          inputProps={{ readOnly }}
        >
          <MenuItem value="Waterfall">Waterfall</MenuItem>
          <MenuItem value="Agile">Agile</MenuItem>
        </Select>
      </FormControl>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {TABS.map((tab) => (
            <Tab key={tab} label={tab} sx={{ textTransform: 'none', fontSize: 13 }} />
          ))}
        </Tabs>
      </Box>

      {/* Panel */}
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        {activeTab === 2 ? (
          <>
            {/* Panel header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5,
                mb: 2,
              }}
            >
              <Typography fontWeight={600} fontSize={15}>
                Support Costs
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder="Search all columns"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 220 }}
                />
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => setSearch('')}
                >
                  Clear Filter
                </Button>
                {!readOnly && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                  >
                    Add
                  </Button>
                )}
              </Box>
            </Box>

            {/* Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f7f8fa' }}>
                    {!readOnly && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
                    <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>SDM Split</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>PS Split</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={readOnly ? 4 : 5} align="center" sx={{ color: '#888', py: 4 }}>
                        No records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) =>
                      editingId === row.id ? (
                        <TableRow key={row.id} sx={{ backgroundColor: '#fffbea' }}>
                          {!readOnly && (
                            <TableCell>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditSave(row.id)}
                                title="Save"
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="default"
                                onClick={handleEditCancel}
                                title="Cancel"
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          )}
                          <TableCell>
                            <TextField
                              size="small"
                              value={editValues.item}
                              onChange={(e) => setEditValues((v) => ({ ...v, item: e.target.value }))}
                              sx={{ width: 260 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={editValues.value}
                              onChange={(e) => setEditValues((v) => ({ ...v, value: e.target.value }))}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={editValues.sdmSplit}
                              onChange={(e) => setEditValues((v) => ({ ...v, sdmSplit: e.target.value }))}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={editValues.psSplit}
                              onChange={(e) => setEditValues((v) => ({ ...v, psSplit: e.target.value }))}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow key={row.id} hover>
                          {!readOnly && (
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleEditStart(row)}
                                title="Edit"
                                sx={{ color: '#fff', backgroundColor: '#38a169', borderRadius: 1, mr: 0.5,
                                  '&:hover': { backgroundColor: '#2f8a5a' } }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(row.id)}
                                title="Delete"
                                sx={{ color: '#fff', backgroundColor: '#e53e3e', borderRadius: 1,
                                  '&:hover': { backgroundColor: '#c53030' } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          )}
                          <TableCell>{row.item}</TableCell>
                          <TableCell>{row.value}</TableCell>
                          <TableCell>{row.sdmSplit}</TableCell>
                          <TableCell>{row.psSplit}</TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Box sx={{ py: 5, textAlign: 'center', color: '#888' }}>
            <Typography fontSize={14}>
              Content for <strong>{TABS[activeTab]}</strong> — not yet implemented.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
