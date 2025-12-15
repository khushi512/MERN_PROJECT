import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBarRecruiter from "../components/NavBarRecruiter";
import { getUserPublicProfile } from "../apiCalls/authCalls";
import { X, Download, File, Mail, User, BookOpen } from "lucide-react";
import { getImageUrl } from "../utils/imageUtils";

export default function ProfileApplicantPublic() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserPublicProfile(id);
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <NavBarRecruiter />
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <NavBarRecruiter />
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h2 className="text-red-600 text-xl font-semibold mb-2">User not found</h2>
            <p className="text-gray-600">This applicant profile could not be loaded.</p>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <NavBarRecruiter />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <div className="flex items-center gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  {user.profilePic ? (
                    <img
                      src={getImageUrl(user.profilePic)}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-3xl shadow-lg">
                      {user.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                  <p className="text-blue-100 text-lg">@{user.userName}</p>
                  <p className="text-blue-100 flex items-center gap-2 mt-2">
                    <Mail size={16} />
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-8">
              {/* Bio */}
              {user.bio && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen size={24} className="text-blue-600" />
                    Bio
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">{user.bio}</p>
                </div>
              )}

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-3">
                    {user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume */}
              {user.resumeUrl && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <File size={24} className="text-blue-600" />
                    Resume
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-gray-800 font-semibold">Resume Uploaded</p>
                      <p className="text-gray-600 text-sm">Download to view details</p>
                    </div>
                    <a
                      href={getImageUrl(user.resumeUrl)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Download size={18} />
                      Download Resume
                    </a>
                  </div>
                </div>
              )}

              {/* No Resume */}
              {!user.resumeUrl && (
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-600 text-center">No resume uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}