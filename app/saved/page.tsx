'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, FolderPlus, Tag, Search, Filter, X, FileDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Idea } from '@/types';
import { exportMultipleIdeasToPDF } from '@/lib/pdf-export';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic'

interface Folder {
  id: string;
  name: string;
  color: string;
}

interface Tag {
  id: string;
  name: string;
}

interface IdeaWithRelations extends Idea {
  saved_idea_id: string;
  folders: Folder[];
  tags: Tag[];
}

export default function SavedIdeasPage() {
  const [savedIdeas, setSavedIdeas] = useState<IdeaWithRelations[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<IdeaWithRelations[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Dialogs
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showAddToFolderDialog, setShowAddToFolderDialog] = useState(false);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  // Form inputs
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#6B7280');
  const [newTagName, setNewTagName] = useState('');

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterIdeas();
  }, [savedIdeas, searchQuery, selectedFolder, selectedTags]);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Fetch folders
      const { data: foldersData } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setFolders(foldersData || []);

      // Fetch tags
      const { data: tagsData } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      setTags(tagsData || []);

      // Fetch saved ideas with folders and tags
      const { data: savedIdeasData, error } = await supabase
        .from('saved_ideas')
        .select(`
          id,
          idea_id,
          ideas (*)
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;

      // Fetch folders and tags for each idea
      const ideasWithRelations = await Promise.all(
        (savedIdeasData || []).map(async (item: any) => {
          // Get folders for this idea
          const { data: ideaFolders } = await supabase
            .from('idea_folders')
            .select('folder_id, folders(*)')
            .eq('idea_id', item.idea_id);

          // Get tags for this idea
          const { data: ideaTags } = await supabase
            .from('idea_tags')
            .select('tag_id, tags(*)')
            .eq('idea_id', item.idea_id);

          return {
            ...item.ideas,
            saved_idea_id: item.id,
            folders: ideaFolders?.map((f: any) => f.folders) || [],
            tags: ideaTags?.map((t: any) => t.tags) || [],
          };
        })
      );

      setSavedIdeas(ideasWithRelations);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load saved ideas');
    } finally {
      setLoading(false);
    }
  };

  const filterIdeas = () => {
    let filtered = [...savedIdeas];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(query) ||
        idea.description.toLowerCase().includes(query) ||
        idea.technology?.toLowerCase().includes(query) ||
        idea.monetization?.toLowerCase().includes(query)
      );
    }

    // Folder filter
    if (selectedFolder) {
      filtered = filtered.filter(idea =>
        idea.folders.some(f => f.id === selectedFolder)
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(idea =>
        selectedTags.every(tagId =>
          idea.tags.some(t => t.id === tagId)
        )
      );
    }

    setFilteredIdeas(filtered);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('folders')
        .insert({
          user_id: user.id,
          name: newFolderName.trim(),
          color: newFolderColor,
        })
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => [data, ...prev]);
      setNewFolderName('');
      setNewFolderColor('#6B7280');
      setShowNewFolderDialog(false);
      toast.success('Folder created!');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const addIdeaToFolder = async (folderId: string) => {
    if (!selectedIdeaId) return;

    try {
      const { error } = await supabase
        .from('idea_folders')
        .insert({
          idea_id: selectedIdeaId,
          folder_id: folderId,
        });

      if (error) throw error;

      await fetchData();
      setShowAddToFolderDialog(false);
      setSelectedIdeaId(null);
      toast.success('Added to folder!');
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Idea already in this folder');
      } else {
        toast.error('Failed to add to folder');
      }
    }
  };

  const removeIdeaFromFolder = async (ideaId: string, folderId: string) => {
    try {
      const { error } = await supabase
        .from('idea_folders')
        .delete()
        .eq('idea_id', ideaId)
        .eq('folder_id', folderId);

      if (error) throw error;

      await fetchData();
      toast.success('Removed from folder');
    } catch (error) {
      toast.error('Failed to remove from folder');
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tags')
        .insert({
          user_id: user.id,
          name: newTagName.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewTagName('');
      toast.success('Tag created!');
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Tag already exists');
      } else {
        toast.error('Failed to create tag');
      }
    }
  };

  const addTagToIdea = async (tagId: string) => {
    if (!selectedIdeaId) return;

    try {
      const { error } = await supabase
        .from('idea_tags')
        .insert({
          idea_id: selectedIdeaId,
          tag_id: tagId,
        });

      if (error) throw error;

      await fetchData();
      toast.success('Tag added!');
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Tag already added');
      } else {
        toast.error('Failed to add tag');
      }
    }
  };

  const removeTagFromIdea = async (ideaId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('idea_tags')
        .delete()
        .eq('idea_id', ideaId)
        .eq('tag_id', tagId);

      if (error) throw error;

      await fetchData();
      toast.success('Tag removed');
    } catch (error) {
      toast.error('Failed to remove tag');
    }
  };

  const handleUnsave = async (savedIdeaId: string, ideaId: string) => {
    try {
      const { error } = await supabase
        .from('saved_ideas')
        .delete()
        .eq('id', savedIdeaId);

      if (error) throw error;

      setSavedIdeas(prev => prev.filter(idea => idea.id !== ideaId));
      toast.success('Idea removed from saved');
    } catch (error) {
      console.error('Error removing idea:', error);
      toast.error('Failed to remove idea');
    }
  };

  const toggleTagFilter = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleExportAll = () => {
    if (filteredIdeas.length === 0) {
      toast.error('No ideas to export');
      return;
    }

    try {
      let title = 'My Saved Ideas';
      if (selectedFolder) {
        const folder = folders.find(f => f.id === selectedFolder);
        if (folder) title = folder.name;
      }
      exportMultipleIdeasToPDF(filteredIdeas, title);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Saved Ideas</h1>
              <p className="text-gray-600 mt-2">
                {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'}
                {searchQuery || selectedFolder || selectedTags.length > 0 ? ' (filtered)' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportAll} disabled={filteredIdeas.length === 0}>
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={() => setShowNewFolderDialog(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search saved ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Folder Filter */}
            {folders.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 flex items-center">
                  <Filter className="w-4 h-4 mr-1" />
                  Folders:
                </span>
                <Button
                  variant={selectedFolder === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFolder(null)}
                >
                  All
                </Button>
                {folders.map(folder => (
                  <Button
                    key={folder.id}
                    variant={selectedFolder === folder.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFolder(folder.id)}
                    style={{
                      borderColor: selectedFolder === folder.id ? folder.color : undefined,
                      backgroundColor: selectedFolder === folder.id ? folder.color : undefined,
                    }}
                  >
                    {folder.name}
                  </Button>
                ))}
              </div>
            )}

            {/* Tag Filter */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Tags:
                </span>
                {tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTagFilter(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ideas Grid */}
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedFolder || selectedTags.length > 0
                ? 'No ideas match your filters'
                : 'No saved ideas yet'}
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Discover Ideas
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredIdeas.map((idea: IdeaWithRelations) => (
              <Card
                key={idea.id}
                className="cursor-pointer hover:shadow-uber-lg transition-all"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div
                      className="flex-1"
                      onClick={() => router.push(`/idea/${idea.id}`)}
                    >
                      <CardTitle className="text-xl mb-2">{idea.title}</CardTitle>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {idea.technology && (
                          <span className="text-xs px-3 py-1.5 bg-black text-white rounded-uber font-medium">
                            {idea.technology}
                          </span>
                        )}
                        {idea.complexity && (
                          <span className="text-xs px-3 py-1.5 bg-black text-white rounded-uber font-medium">
                            {idea.complexity}
                          </span>
                        )}
                      </div>

                      {/* Folders and Tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {idea.folders.map(folder => (
                          <Badge
                            key={folder.id}
                            variant="outline"
                            style={{ borderColor: folder.color, color: folder.color }}
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeIdeaFromFolder(idea.id, folder.id);
                            }}
                          >
                            {folder.name} <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                        {idea.tags.map(tag => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTagFromIdea(idea.id, tag.id);
                            }}
                          >
                            {tag.name} <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedIdeaId(idea.id);
                          setShowAddToFolderDialog(true);
                        }}
                        title="Add to folder"
                      >
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedIdeaId(idea.id);
                          setShowAddTagDialog(true);
                        }}
                        title="Add tag"
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnsave(idea.saved_idea_id, idea.id)}
                        title="Remove from saved"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent onClick={() => router.push(`/idea/${idea.id}`)}>
                  <CardDescription className="text-base">
                    {idea.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Organize your ideas into folders
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createFolder()}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Color:</label>
              <input
                type="color"
                value={newFolderColor}
                onChange={(e) => setNewFolderColor(e.target.value)}
                className="h-10 w-20 rounded cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Folder Dialog */}
      <Dialog open={showAddToFolderDialog} onOpenChange={setShowAddToFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Folder</DialogTitle>
            <DialogDescription>
              Select a folder to add this idea to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {folders.map(folder => (
              <Button
                key={folder.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => addIdeaToFolder(folder.id)}
                style={{ borderColor: folder.color }}
              >
                <div
                  className="w-4 h-4 rounded mr-2"
                  style={{ backgroundColor: folder.color }}
                />
                {folder.name}
              </Button>
            ))}
            {folders.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-4">
                No folders yet. Create one first!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Tag Dialog */}
      <Dialog open={showAddTagDialog} onOpenChange={setShowAddTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
            <DialogDescription>
              Create and add tags to organize your ideas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createTag()}
              />
              <Button onClick={createTag}>Create</Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-600">Existing tags:</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => addTagToIdea(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <p className="text-sm text-gray-500">No tags yet</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
