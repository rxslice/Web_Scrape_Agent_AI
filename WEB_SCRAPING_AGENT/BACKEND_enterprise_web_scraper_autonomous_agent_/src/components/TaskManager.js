import React, { useState, useEffect } from 'react';
    import Typography from '@mui/material/Typography';
    import Table from '@mui/material/Table';
    import TableBody from '@mui/material/TableBody';
    import TableCell from '@mui/material/TableCell';
    import TableContainer from '@mui/material/TableContainer';
    import TableHead from '@mui/material/TableHead';
    import TableRow from '@mui/material/TableRow';
    import Paper from '@mui/material/Paper';
    import Button from '@mui/material/Button';
    import Dialog from '@mui/material/Dialog';
    import DialogTitle from '@mui/material/DialogTitle';
    import DialogContent from '@mui/material/DialogContent';
    import DialogActions from '@mui/material/DialogActions';
    import TextField from '@mui/material/TextField';
    import FormControlLabel from '@mui/material/FormControlLabel';
    import Checkbox from '@mui/material/Checkbox';
    import IconButton from '@mui/material/IconButton';
    import EditIcon from '@mui/icons-material/Edit';
    import DeleteIcon from '@mui/icons-material/Delete';
    import AddIcon from '@mui/icons-material/Add';
    import axios from 'axios';
    import JSONEditor from './JSONEditor';
    import Select from '@mui/material/Select';
    import MenuItem from '@mui/material/MenuItem';
    import InputLabel from '@mui/material/InputLabel';
    import FormControl from '@mui/material/FormControl';

    function TaskManager() {
      const [tasks, setTasks] = useState([]);
      const [openDialog, setOpenDialog] = useState(false);
      const [selectedTask, setSelectedTask] = useState(null);
      const [taskForm, setTaskForm] = useState({
        name: '',
        url: '',
        schedule: '',
        priority: 1,
        headers: {},
        retry: { maxAttempts: 1, delay: 0 },
        extractionRules: {},
        validationRules: {},
        transformationRules: {},
        processingRules: {},
        webhookUrl: '',
        apiCall: { url: '', method: 'GET', body: {}, headers: {} },
        nlpAnalysis: false,
        deduplicationKeys: [],
        anomalyDetection: { fields: [] },
        aiContentExtraction: { keywords: [] },
        usePuppeteer: false,
        visualScraping: { imageSelector: '' },
        pagination: { nextSelector: '', maxPages: 1 },
        dependsOn: '',
      });
      const [allTasks, setAllTasks] = useState([]);

      useEffect(() => {
        const fetchTasks = async () => {
          try {
            const response = await axios.get('/api/tasks');
            setTasks(response.data);
            setAllTasks(response.data);
          } catch (error) {
            console.error('Error fetching tasks:', error);
          }
        };

        fetchTasks();
      }, []);

      const handleOpenDialog = (task) => {
        setSelectedTask(task);
        setTaskForm(task ? { ...task } : {
          name: '',
          url: '',
          schedule: '',
          priority: 1,
          headers: {},
          retry: { maxAttempts: 1, delay: 0 },
          extractionRules: {},
          validationRules: {},
          transformationRules: {},
          processingRules: {},
          webhookUrl: '',
          apiCall: { url: '', method: 'GET', body: {}, headers: {} },
          nlpAnalysis: false,
          deduplicationKeys: [],
          anomalyDetection: { fields: [] },
          aiContentExtraction: { keywords: [] },
          usePuppeteer: false,
          visualScraping: { imageSelector: '' },
          pagination: { nextSelector: '', maxPages: 1 },
          dependsOn: '',
        });
        setOpenDialog(true);
      };

      const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTask(null);
      };

      const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setTaskForm((prevForm) => {
          if (type === 'checkbox') {
            return { ...prevForm, [name]: checked };
          } else if (name.startsWith('retry.')) {
            const retryKey = name.split('.')[1];
            return { ...prevForm, retry: { ...prevForm.retry, [retryKey]: value } };
          } else if (name.startsWith('apiCall.')) {
            const apiCallKey = name.split('.')[1];
            return { ...prevForm, apiCall: { ...prevForm.apiCall, [apiCallKey]: value } };
          } else if (name.startsWith('visualScraping.')) {
            const visualScrapingKey = name.split('.')[1];
            return { ...prevForm, visualScraping: { ...prevForm.visualScraping, [visualScrapingKey]: value } };
          } else if (name.startsWith('pagination.')) {
            const paginationKey = name.split('.')[1];
            return { ...prevForm, pagination: { ...prevForm.pagination, [paginationKey]: value } };
          }
          return { ...prevForm, [name]: value };
        });
      };

      const handleJSONChange = (name, value) => {
        setTaskForm((prevForm) => ({ ...prevForm, [name]: value }));
      };

      const handleArrayChange = (name, value) => {
        setTaskForm((prevForm) => ({ ...prevForm, [name]: value }));
      };

      const handleSubmit = async () => {
        try {
          if (selectedTask) {
            await axios.put(`/api/tasks/${selectedTask.name}`, taskForm);
            setTasks(tasks.map(task => task.name === selectedTask.name ? taskForm : task));
          } else {
            await axios.post('/api/tasks', taskForm);
            setTasks([...tasks, taskForm]);
          }
          handleCloseDialog();
        } catch (error) {
          console.error('Error submitting task:', error);
        }
      };

      const handleDelete = async (taskName) => {
        try {
          await axios.delete(`/api/tasks/${taskName}`);
          setTasks(tasks.filter(task => task.name !== taskName));
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      };

      return (
        <div>
          <Typography variant="h5" gutterBottom>
            Task Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog(null)}
            style={{ marginBottom: '16px' }}
          >
            Add Task
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.name}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.url}</TableCell>
                    <TableCell>{task.schedule}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(task)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(task.name)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <DialogTitle>{selectedTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                name="name"
                value={taskForm.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="URL"
                name="url"
                value={taskForm.url}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Schedule (Cron Expression)"
                name="schedule"
                value={taskForm.schedule}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Priority"
                name="priority"
                type="number"
                value={taskForm.priority}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Max Retry Attempts"
                name="retry.maxAttempts"
                type="number"
                value={taskForm.retry.maxAttempts}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Retry Delay (ms)"
                name="retry.delay"
                type="number"
                value={taskForm.retry.delay}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <JSONEditor
                label="Headers"
                name="headers"
                value={taskForm.headers}
                onChange={handleJSONChange}
              />
              <JSONEditor
                label="Extraction Rules"
                name="extractionRules"
                value={taskForm.extractionRules}
                onChange={handleJSONChange}
              />
              <JSONEditor
                label="Validation Rules"
                name="validationRules"
                value={taskForm.validationRules}
                onChange={handleJSONChange}
              />
              <JSONEditor
                label="Transformation Rules"
                name="transformationRules"
                value={taskForm.transformationRules}
                onChange={handleJSONChange}
              />
              <JSONEditor
                label="Processing Rules"
                name="processingRules"
                value={taskForm.processingRules}
                onChange={handleJSONChange}
              />
              <TextField
                label="Webhook URL"
                name="webhookUrl"
                value={taskForm.webhookUrl}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="API Call URL"
                name="apiCall.url"
                value={taskForm.apiCall.url}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="API Call Method"
                name="apiCall.method"
                value={taskForm.apiCall.method}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <JSONEditor
                label="API Call Body"
                name="apiCall.body"
                value={taskForm.apiCall.body}
                onChange={handleJSONChange}
              />
              <JSONEditor
                label="API Call Headers"
                name="apiCall.headers"
                value={taskForm.apiCall.headers}
                onChange={handleJSONChange}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={taskForm.nlpAnalysis}
                    onChange={handleInputChange}
                    name="nlpAnalysis"
                  />
                }
                label="Enable NLP Analysis"
              />
              <JSONEditor
                label="Deduplication Keys"
                name="deduplicationKeys"
                value={taskForm.deduplicationKeys}
                onChange={handleArrayChange}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!taskForm.anomalyDetection.fields.length}
                    onChange={(e) => handleInputChange({ target: { name: 'anomalyDetection.fields', value: e.target.checked ? ['description'] : [] } })}
                    name="anomalyDetection.fields"
                  />
                }
                label="Enable Anomaly Detection"
              />
              {taskForm.anomalyDetection.fields.length > 0 && (
                <JSONEditor
                  label="Anomaly Detection Fields"
                  name="anomalyDetection.fields"
                  value={taskForm.anomalyDetection.fields}
                  onChange={handleArrayChange}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!taskForm.aiContentExtraction.keywords.length}
                    onChange={(e) => handleInputChange({ target: { name: 'aiContentExtraction.keywords', value: e.target.checked ? ['important', 'information'] : [] } })}
                    name="aiContentExtraction.keywords"
                  />
                }
                label="Enable AI Content Extraction"
              />
              {taskForm.aiContentExtraction.keywords.length > 0 && (
                <JSONEditor
                  label="AI Content Extraction Keywords"
                  name="aiContentExtraction.keywords"
                  value={taskForm.aiContentExtraction.keywords}
                  onChange={handleArrayChange}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={taskForm.usePuppeteer}
                    onChange={handleInputChange}
                    name="usePuppeteer"
                  />
                }
                label="Use Puppeteer"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!taskForm.visualScraping.imageSelector}
                    onChange={(e) => handleInputChange({ target: { name: 'visualScraping.imageSelector', value: e.target.checked ? 'img.main-image' : '' } })}
                    name="visualScraping.imageSelector"
                  />
                }
                label="Enable Visual Scraping"
              />
              {taskForm.visualScraping.imageSelector && (
                <TextField
                  label="Image Selector"
                  name="visualScraping.imageSelector"
                  value={taskForm.visualScraping.imageSelector}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!taskForm.pagination.nextSelector}
                    onChange={(e) => handleInputChange({ target: { name: 'pagination.nextSelector', value: e.target.checked ? '.nav .next a' : '' } })}
                    name="pagination.nextSelector"
                  />
                }
                label="Enable Pagination"
              />
              {taskForm.pagination.nextSelector && (
                <>
                  <TextField
                    label="Next Page Selector"
                    name="pagination.nextSelector"
                    value={taskForm.pagination.nextSelector}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Max Pages"
                    name="pagination.maxPages"
                    type="number"
                    value={taskForm.pagination.maxPages}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </>
              )}
              <FormControl fullWidth margin="normal">
                <InputLabel id="depends-on-label">Depends On</InputLabel>
                <Select
                  labelId="depends-on-label"
                  id="dependsOn"
                  name="dependsOn"
                  value={taskForm.dependsOn}
                  label="Depends On"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {allTasks.map((task) => (
                    <MenuItem key={task.name} value={task.name}>{task.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} color="primary">
                {selectedTask ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }

    export default TaskManager;
