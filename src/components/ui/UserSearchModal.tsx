'use client'

import { useState, useEffect } from 'react'
import { Search, X, User, CreditCard, Banknote, Briefcase, Calendar, ArrowRight } from 'lucide-react'
import { strapiService } from '@/lib/api'

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserSearchModal({ isOpen, onClose }: UserSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userBobs, setUserBobs] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Recherche d'utilisateurs
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      return
    }

    const searchUsers = async () => {
      setLoading(true)
      try {
        const users = await strapiService.getUsersPaginated(1, 10, {
          username: searchTerm,
          email: searchTerm
        })
        setSearchResults(users.data || users)
      } catch (error) {
        console.error('Erreur recherche utilisateurs:', error)
      }
      setLoading(false)
    }

    const debounce = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm])

  // Récupérer les BOBs d'un utilisateur sélectionné
  const selectUser = async (user: any) => {
    setSelectedUser(user)
    setLoading(true)
    try {
      const bobs = await strapiService.getUserBobs(user.id)
      setUserBobs(bobs)
    } catch (error) {
      console.error('Erreur récupération BOBs:', error)
    }
    setLoading(false)
  }

  const resetModal = () => {
    setSearchTerm('')
    setSearchResults([])
    setSelectedUser(null)
    setUserBobs(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              🔍 Recherche Utilisateur & BOBs
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Trouvez un utilisateur et consultez ses emprunts/prêts
            </p>
          </div>
          <button
            onClick={resetModal}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {!selectedUser ? (
            <>
              {/* Barre de recherche */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Résultats de recherche */}
              <div className="space-y-3">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => selectUser(user)}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 cursor-pointer transition-all duration-200 border border-gray-200/50 dark:border-gray-600/50"
                  >
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {user.username || user.firstname || user.email?.split('@')[0] || 'Utilisateur'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </div>
                      {user.firstname && user.lastname && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {user.firstname} {user.lastname}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}

                {searchTerm.length >= 2 && !loading && searchResults.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Aucun utilisateur trouvé pour &quot;{searchTerm}&quot;
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Profil utilisateur sélectionné */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mb-4"
                >
                  ← Retour à la recherche
                </button>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {(selectedUser.username || selectedUser.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedUser.username || selectedUser.firstname || selectedUser.email?.split('@')[0] || 'Utilisateur'}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                      {selectedUser.firstname && selectedUser.lastname && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {selectedUser.firstname} {selectedUser.lastname}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          selectedUser.confirmed ?
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {selectedUser.confirmed ? 'Confirmé' : 'En attente'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Inscrit le {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOBs de l'utilisateur */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : userBobs ? (
                <div className="space-y-6">
                  {/* Résumé des BOBs */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{userBobs.emprunts.length}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Emprunts</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex items-center gap-3">
                        <Banknote className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{userBobs.prets.length}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Prêts</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{userBobs.services.length}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Services</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-orange-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{userBobs.total}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total BOBs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liste détaillée des BOBs */}
                  {userBobs.total > 0 ? (
                    <div className="space-y-4">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Historique des BOBs</h5>

                      {/* Emprunts */}
                      {userBobs.emprunts.length > 0 && (
                        <div>
                          <h6 className="text-md font-medium text-green-600 dark:text-green-400 mb-2">💳 Emprunts ({userBobs.emprunts.length})</h6>
                          <div className="space-y-2">
                            {userBobs.emprunts.map((emprunt: any, index: number) => (
                              <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200/50 dark:border-green-700/50">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  <strong>Emprunt #{emprunt.id}</strong> - {new Date(emprunt.createdAt).toLocaleDateString('fr-FR')}
                                </div>
                                {emprunt.attributes && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {JSON.stringify(emprunt.attributes, null, 2)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prêts */}
                      {userBobs.prets.length > 0 && (
                        <div>
                          <h6 className="text-md font-medium text-blue-600 dark:text-blue-400 mb-2">💰 Prêts ({userBobs.prets.length})</h6>
                          <div className="space-y-2">
                            {userBobs.prets.map((pret: any, index: number) => (
                              <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200/50 dark:border-blue-700/50">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  <strong>Prêt #{pret.id}</strong> - {new Date(pret.createdAt).toLocaleDateString('fr-FR')}
                                </div>
                                {pret.attributes && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {JSON.stringify(pret.attributes, null, 2)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Services */}
                      {userBobs.services.length > 0 && (
                        <div>
                          <h6 className="text-md font-medium text-purple-600 dark:text-purple-400 mb-2">🛠️ Services ({userBobs.services.length})</h6>
                          <div className="space-y-2">
                            {userBobs.services.map((service: any, index: number) => (
                              <div key={index} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200/50 dark:border-purple-700/50">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  <strong>Service #{service.id}</strong> - {new Date(service.createdAt).toLocaleDateString('fr-FR')}
                                </div>
                                {service.attributes && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {JSON.stringify(service.attributes, null, 2)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Cet utilisateur n&apos;a encore fait aucun BOB
                    </div>
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}