import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { User, Code, Link as LinkIcon, Upload, X } from 'lucide-react';


const CompleteContributorProfile = () => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    fullName: '',
    professionalTitle: '',
    professionalBio: '',
    skills: ['JavaScript', 'React'],
    linkedin: '',
    github: '',
    website: ''
  });

  const [bioCharCount, setBioCharCount] = useState(0);
  const [progress, setProgress] = useState(10);
  const [newSkill, setNewSkill] = useState('');

  const suggestedSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'CSS', 'HTML', 'UI/UX Design'];

  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Calculate progress
  useEffect(() => {
    let completedFields = 0;
    const totalFields = 8;

    if (formData.profilePicture) completedFields++;
    if (formData.fullName.trim()) completedFields++;
    if (formData.professionalTitle.trim()) completedFields++;
    if (formData.professionalBio.trim()) completedFields++;
    if (formData.skills.length >= 2) completedFields++;
    if (formData.linkedin.trim()) completedFields++;
    if (formData.github.trim()) completedFields++;
    if (formData.website.trim()) completedFields++;

    const newProgress = Math.round((completedFields / totalFields) * 100);
    setProgress(newProgress);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'professionalBio') {
      setBioCharCount(value.length);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('File size must be less than 5MB');
    }
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill) && formData.skills.length < 10) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map form fields to API shape
    const [firstName = '', ...rest] = formData.fullName.trim().split(' ');
    const lastName = rest.join(' ') || '';

    const payload = {
      firstName: firstName || 'Wallet',
      lastName: lastName || 'User',
      bio: formData.professionalBio,
    };

    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to save profile');
        }
        return res.json();
      })
      .then(async (data) => {
        // Refresh auth context so UI updates
        await refresh();
        // If a returnTo param exists (e.g. coming from waitlist), go back there
        try {
          const params = new URLSearchParams(window.location.search);
          const returnTo = params.get('returnTo');
          if (returnTo === 'waitlist') {
            navigate('/waitlist');
            return;
          }
        } catch (e) {
          // ignore
        }
        // Navigate to dashboard after completing profile
        navigate(getNextRoute(data.user || null));
      })
      .catch((err) => {
        alert(err.message || 'Save failed');
      });
  };

  // helpers
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const getNextRoute = (u) => {
    // Basic fallback: go to root or dashboard based on role
    if (!u) return '/';
    if (!u.role) return '/onboarding';
    if (!u.profileCompleted) return '/complete-profile';
    return u.role === 'creator' ? '/dashboard/creator' : '/dashboard/contributor';
  };

  const getInitials = () => {
    if (formData.fullName) {
      const names = formData.fullName.trim().split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'SA';
  };

  return (
    <div className="min-h-screen  py-8 px-4" style={{ fontFamily: 'Figtree, sans-serif' }}>
      <div className="mb-12 md:mb-14"> 
 {/* < Navbar /> */}

      </div>
     
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete your profile</h1>
          <p className="text-gray-600">Let's set up your contributor profile to attract great clients</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Complete your profile</h2>
            <span className="text-2xl font-bold" style={{ 
              background: 'linear-gradient(to right, #0C13FF, #22C0FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="h-2.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(to right, #0C13FF, #22C0FF)'
              }}
            />
          </div>
          <p className="text-sm text-gray-600">Complete your profile to increase your chance of getting hired.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Basics */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Basics</h2>
            </div>

            {/* Profile Picture */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold text-white"
                  style={{ 
                    background: formData.profilePicture ? 'transparent' : 'linear-gradient(to right, #0C13FF, #22C0FF)',
                    backgroundImage: formData.profilePicture ? `url(${formData.profilePicture})` : 'none',
                    // backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!formData.profilePicture && getInitials()}
                </div>
                {/* Thumbnail preview to the right of the button */}
                {formData.profilePicture && (
                  <img
                    src={String(formData.profilePicture)}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-md object-cover ml-2 border border-gray-200"
                  />
                )}
                <label className="cursor-pointer">
                  {/* <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  /> */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </div>
                </label>
                
              </div>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG, or GIF. Max size 5MB</p>
            </div>

            {/* Full Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Professional Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Professional Title</label>
              <input
                type="text"
                value={formData.professionalTitle}
                onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                placeholder="e.g., Full Stack Developer, UI/UX Designer, Content Writer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">This appears as your headline</p>
            </div>

            {/* Professional Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Professional Bio</label>
              <textarea
                value={formData.professionalBio}
                onChange={(e) => handleInputChange('professionalBio', e.target.value)}
                placeholder="Tell us about yourself, your expertise, and what makes you unique."
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
              <p className="text-xs text-blue-600 mt-1">{bioCharCount}/500 characters</p>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
            </div>

            {/* Add Skills */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">Add Skills</label>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(newSkill);
                  }
                }}
                placeholder="Type to search skills"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-blue-600 mt-1">Add up to 10 skills that describe your expertise</p>
            </div>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Skills</label>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills
                  .filter(skill => !formData.skills.includes(skill))
                  .map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                    >
                      {skill}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Social Links <span className="text-gray-500 font-normal">(optional)</span></h2>
            </div>

            {/* LinkedIn */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">LinkedIn</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* GitHub */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">GitHub</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  placeholder="https://github.com/in/yourusername"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Personal Website */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Personal Website</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition shadow-lg"
              style={{ background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteContributorProfile;